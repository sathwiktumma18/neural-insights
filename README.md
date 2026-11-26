# Neural Insights - Business AI Dashboard

A comprehensive AI-powered business intelligence platform for sales prediction, customer segmentation, and data-driven decision making.

## Features

- **Sales Prediction**: Forecast future sales using machine learning
- **Customer Segmentation**: Automatically group customers based on behavior
- **Business Dashboard**: Real-time insights and visualizations
- **Data Upload**: Secure CSV upload for sales and customer data
- **Marketing Recommendations**: AI-powered campaign strategies

## Tech Stack

### Backend
- **Python** with Flask
- **SQLite** database (no setup required)
- **Scikit-learn** for ML models
- **Pandas/Numpy** for data processing
- **Matplotlib/Seaborn** for visualizations

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Shadcn/UI** components
- **Recharts** for data visualization
- **React Query** for API state management

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Run the Application

1. Start the backend:
   ```bash
   python backend/app.py
   ```
   The backend will run on http://localhost:5000

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:8080 (or the port shown in the terminal)

### 4. Test with Sample Data

1. Go to the Data Upload page in the app
2. Upload `sample_sales.csv` as Sales Data
3. Upload `sample_customers.csv` as Customer Data
4. Go to the Dashboard to see the data
5. Train models and generate predictions

## Usage

### 1. Upload Data

- Go to the Data Upload page
- Upload CSV files for sales and customer data
- Follow the required column formats shown on the page

### 2. Train Models

- Upload sales data to train the sales prediction model
- Upload customer data to train the customer segmentation model

### 3. View Dashboard

- Check the main dashboard for real-time insights
- View sales trends and customer segments
- Monitor key business metrics

### 4. Generate Forecasts

- Go to the Forecasting page
- Select the number of months to predict
- View predicted sales with confidence intervals

## Data Formats

### Sales Data CSV
Required columns:
- `date` (YYYY-MM-DD)
- `product` (string)
- `quantity` (number)
- `price` (number)
- `customer_id` (number)

### Customer Data CSV
Required columns:
- `name` (string)
- `email` (string)
- `age` (number)
- `location` (string)
- `total_spent` (number)

## API Endpoints

- `POST /api/upload-data` - Upload CSV data
- `POST /api/train-sales-model` - Train sales prediction model
- `POST /api/predict-sales` - Get sales predictions
- `POST /api/train-customer-segmentation` - Train customer segmentation
- `GET /api/get-customer-segments` - Get customer segments
- `GET /api/get-dashboard-data` - Get dashboard metrics
- `GET /api/get-marketing-recommendations` - Get marketing insights

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Backend Development
The Flask app supports hot reloading. Any changes to `app.py` will automatically restart the server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.