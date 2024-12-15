FROM python:3.13

WORKDIR /

COPY ./requirements.txt ./

RUN pip3 install --no-cache-dir --upgrade -r ./requirements.txt

COPY . .

EXPOSE 3030
CMD ["python", "main.py"]