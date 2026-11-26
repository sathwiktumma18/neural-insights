from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Paths:
    project_root: Path
    models_dir: Path
    sample_sales_csv: Path
    sample_customers_csv: Path


def get_paths() -> Paths:
    # This file lives at backend/ml/common.py → project root is three levels up.
    root = Path(__file__).resolve().parents[2]
    models_dir = Path(os.getenv("ML_MODELS_PATH", str(root / "backend" / "ml" / "saved_models")))
    models_dir = models_dir if models_dir.is_absolute() else (root / models_dir).resolve()
    models_dir.mkdir(parents=True, exist_ok=True)

    return Paths(
        project_root=root,
        models_dir=models_dir,
        sample_sales_csv=root / "sample_sales.csv",
        sample_customers_csv=root / "sample_customers.csv",
    )

