FROM python:3.10

WORKDIR /app

COPY webChess/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY webChess/ .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
