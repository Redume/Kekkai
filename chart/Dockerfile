FROM python:3.13-alpine

WORKDIR /

COPY . .

RUN pip3 install --no-cache-dir --upgrade -r ./requirements.txt

EXPOSE 3030
CMD ["python", "main.py"]