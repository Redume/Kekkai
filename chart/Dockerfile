FROM python:3.13-alpine

WORKDIR /

COPY . .

RUN apk add --no-cache gcc g++ musl-dev python3-dev libffi-dev openssl-dev postgresql-dev

RUN pip3 install --no-cache-dir --upgrade -r ./requirements.txt

EXPOSE 3030
CMD ["python", "main.py"]