FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./src .
ENV PYTHONPATH=/app
EXPOSE 8888
CMD ["python", "main.py"]