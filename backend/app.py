from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
import json
import sqlite3
import os
from datetime import datetime
import joblib

app = Flask(__name__)
CORS(app)

# Register AI routes (keeps existing routes unchanged)
try:
    # Ensure project root is on sys.path even when running from /backend.
    import sys

    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

    try:
        # Works when running from within `backend/`
        from routes.ai_routes import ai_bp  # type: ignore
    except Exception:
        # Works when importing as a package from repo root
        from backend.routes.ai_routes import ai_bp  # type: ignore

    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    try:
        ai_rules = [r.rule for r in app.url_map.iter_rules() if r.rule.startswith("/api/ai")]
        print(f"[AI routes] Loaded {len(ai_rules)} routes")
    except Exception:
        pass
except Exception as _e:
    # Don't crash startup if optional AI deps aren't installed yet
    print(f"[AI routes] Not loaded: {_e}")

# Database file
DB_FILE = 'business_ai.db'

# Database connection
def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            product TEXT,
            quantity INTEGER,
            price REAL,
            customer_id INTEGER
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            age INTEGER,
            location TEXT,
            total_spent REAL,
            segment INTEGER DEFAULT 0
        )
    ''')
    
    conn.commit()
    cursor.close()
    conn.close()

@app.route('/api/upload-data', methods=['POST'])
def upload_data():
    try:
        file = request.files['file']
        data_type = request.form.get('type')  # 'sales' or 'customers'
        
        df = pd.read_csv(file)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if data_type == 'sales':
            for _, row in df.iterrows():
                cursor.execute('''
                    INSERT INTO sales_data (date, product, quantity, price, customer_id)
                    VALUES (?, ?, ?, ?, ?)
                ''', (row['date'], row['product'], row['quantity'], row['price'], row['customer_id']))
        elif data_type == 'customers':
            for _, row in df.iterrows():
                cursor.execute('''
                    INSERT INTO customers (name, email, age, location, total_spent)
                    VALUES (?, ?, ?, ?, ?)
                ''', (row['name'], row['email'], row['age'], row['location'], row['total_spent']))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Data uploaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/train-sales-model', methods=['POST'])
def train_sales_model():
    try:
        conn = get_db_connection()
        df = pd.read_sql('SELECT * FROM sales_data', conn)
        conn.close()
        
        # Prepare data
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        
        # Aggregate monthly sales
        monthly_sales = df.groupby(['year', 'month'])['price'].sum().reset_index()
        monthly_sales['date'] = pd.to_datetime(monthly_sales[['year', 'month']].assign(day=1))
        
        # Features and target
        X = monthly_sales[['year', 'month']]
        y = monthly_sales['price']
        
        # Train model
        model = LinearRegression()
        model.fit(X, y)
        
        # Save model
        joblib.dump(model, 'models/sales_model.pkl')
        
        return jsonify({'message': 'Sales prediction model trained successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predict-sales', methods=['POST'])
def predict_sales():
    try:
        data = request.json
        months_ahead = data.get('months', 6)
        
        model = joblib.load('models/sales_model.pkl')
        
        # Get current date
        current_date = datetime.now()
        predictions = []
        
        for i in range(1, months_ahead + 1):
            pred_date = current_date.replace(month=current_date.month + i, day=1)
            if pred_date.month > 12:
                pred_date = pred_date.replace(year=pred_date.year + 1, month=pred_date.month - 12)
            
            X_pred = [[pred_date.year, pred_date.month]]
            pred_sales = model.predict(X_pred)[0]
            
            predictions.append({
                'date': pred_date.strftime('%Y-%m'),
                'predicted_sales': round(pred_sales, 2)
            })
        
        return jsonify({'predictions': predictions})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/train-customer-segmentation', methods=['POST'])
def train_customer_segmentation():
    try:
        conn = get_db_connection()
        df = pd.read_sql('SELECT * FROM customers', conn)
        conn.close()
        
        # Prepare data
        features = df[['age', 'total_spent']]
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)
        
        # Train K-means
        kmeans = KMeans(n_clusters=3, random_state=42)
        df['segment'] = kmeans.fit_predict(scaled_features)
        
        # Save model and scaler
        joblib.dump(kmeans, 'models/kmeans_model.pkl')
        joblib.dump(scaler, 'models/scaler.pkl')
        
        # Update database with segments
        conn = get_db_connection()
        cursor = conn.cursor()
        for _, row in df.iterrows():
            cursor.execute('UPDATE customers SET segment = ? WHERE id = ?', (int(row['segment']), int(row['id'])))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Customer segmentation model trained successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/get-customer-segments', methods=['GET'])
def get_customer_segments():
    try:
        conn = get_db_connection()
        df = pd.read_sql('SELECT * FROM customers', conn)
        conn.close()
        
        segments = df.groupby('segment').agg({
            'id': 'count',
            'total_spent': 'mean',
            'age': 'mean'
        }).reset_index()
        
        segments.columns = ['segment', 'count', 'avg_spent', 'avg_age']
        
        return jsonify({'segments': segments.to_dict('records')})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/get-dashboard-data', methods=['GET'])
def get_dashboard_data():
    try:
        conn = get_db_connection()
        
        # Sales trends
        sales_df = pd.read_sql('SELECT date, SUM(price) as total_sales FROM sales_data GROUP BY date ORDER BY date', conn)
        
        # Customer insights
        customers_df = pd.read_sql('SELECT * FROM customers', conn)
        
        conn.close()
        
        # Create charts data
        sales_chart = {
            'x': sales_df['date'].tolist(),
            'y': sales_df['total_sales'].tolist(),
            'type': 'line',
            'name': 'Sales Trend'
        }
        
        age_distribution = customers_df['age'].value_counts().sort_index().to_dict()
        
        return jsonify({
            'sales_trend': sales_chart,
            'age_distribution': age_distribution,
            'total_customers': len(customers_df),
            'total_sales': sales_df['total_sales'].sum()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/get-marketing-recommendations', methods=['GET'])
def get_marketing_recommendations():
    try:
        conn = get_db_connection()
        customers_df = pd.read_sql('SELECT * FROM customers', conn)
        sales_df = pd.read_sql('SELECT * FROM sales_data', conn)
        conn.close()
        
        # Simple recommendations based on data
        high_value_customers = customers_df[customers_df['total_spent'] > customers_df['total_spent'].quantile(0.75)]
        young_customers = customers_df[customers_df['age'] < 30]
        
        recommendations = {
            'target_channels': ['Email', 'Social Media', 'Mobile App'],
            'target_audience': 'High-value customers and young adults',
            'campaign_strategies': [
                'Personalized offers for high spenders',
                'Digital campaigns for younger demographics',
                'Loyalty programs for repeat customers'
            ]
        }
        
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    init_db()
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=False, port=5000, use_reloader=False)