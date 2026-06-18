import os
from celery import Celery

REDIS_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")

celery_app = Celery("agrivision_worker", broker=REDIS_URL, backend=REDIS_URL)

celery_app.conf.task_routes = {
    "app.worker.tasks.process_image": "main-queue"
}
