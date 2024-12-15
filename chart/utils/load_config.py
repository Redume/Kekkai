"""
This module provides a function for loading a YAML configuration file.
The function reads the file content and returns it as a Python dictionary.
"""
import yaml

def load_config(file_path: str) -> dict:
    """
    Loads a YAML configuration file and returns its contents as a dictionary.

    This function opens the specified YAML file, parses its content, and
    returns it in dictionary format, making it accessible for use in
    the application.

    :param file_path: The path to the YAML configuration file to be loaded.
    :return: A dictionary containing the parsed content of the YAML file.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return yaml.safe_load(file)

config = load_config('config.yaml')
