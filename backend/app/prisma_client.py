# app/prisma_client.py

import sys
from pathlib import Path

# Try to import from generated client first, fallback to prisma package
try:
    # Add backend directory to path to import generated client
    backend_dir = Path(__file__).parent.parent
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))
    
    # Try importing from generated prisma_client directory
    from prisma_client import Prisma
except ImportError:
    # Fallback to prisma package (will auto-generate if needed)
    from prisma import Prisma

prisma = Prisma()

