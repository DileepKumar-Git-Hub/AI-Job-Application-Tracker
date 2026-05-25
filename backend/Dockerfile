FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# copy requirements and install
COPY backend/job_tracker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# copy project files
COPY backend/job_tracker/ /app

EXPOSE 8000

CMD ["gunicorn", "job_tracker.wsgi:application", "--bind", "0.0.0.0:8000"]
