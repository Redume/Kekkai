FROM python:3.13-slim

WORKDIR /app

COPY chart/requirements.txt .

COPY chart/ /app/

COPY shared/database/schemas/data.sql /app/database/schemas/data.sql

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 3030
CMD ["python", "main.py"]
