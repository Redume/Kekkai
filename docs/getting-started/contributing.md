If you have any questions, you can write to the [mail](mailto:redddume@gmail.com) or [Telegram](https://t.me/Redddume)

### Fork and clone your repository
1. Fork the repository ([click here to fork now](https://github.com/Redume/Kekkai/fork))
2. Clone your forked code 
```bash
git clone https://github.com/<nickname>/Kekkai.git
```
3. Create new branch 
```bash 
git branch <name_new_branch>
```
4. Switch to new branch
```bash
git checkout <name_new_branch>
```
5. Push your commits
6. Submit a new Pull Request

### Testing
Before sending a Pull Request, test the functionality. Everything should work both in Docker Compose and without it.

It is recommended to use Debugger and Debug log for testing. The logging level is changed in `config.yaml`

### Code Style
[`Pylint`][pylint], [`mypy`][mypy],  [`eslint`][eslint] and [`prettier`][prettier] are used as code syntax checks

#### Checking the Node.JS code

To check the code, you must first download the necessary libraries, which are located at the root of the project
```bash
npm install
```

`eslint` and `prettier` is used to check and automatically correct the Node.JS code
```bash
npx eslint .
```
Or add the `--fix` flag to automatically fix the code

#### Checking the Python code
To check code, you need to install libraries `mypy` and `pylint`

```bash
python3 -m pip install -U mypy
```

and install `pylint`
```bash
pip install pylint
```
Start check the code

for `pylint`:
```bash
pylint /chart/
```

and for `mypy`:
```bash
mypy /chart/ 
```



[pylint]: https://github.com/pylint-dev/pylint
[mypy]: https://github.com/python/mypy
[eslint]: https://github.com/eslint/eslint
[prettier]: https://github.com/prettier/prettier