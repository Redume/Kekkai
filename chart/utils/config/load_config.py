"""
Parsing and converting HJSON config to JSON
"""

import json
import hjson


def load_config(file_path: str) -> dict:
    """
    Load an HJSON file, convert it to a JSON string with indentation,
    and return it.

    params: file_path (str): The path to the HJSON file.

    returns str: The JSON string formatted with indentation.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        hjson_data = hjson.load(file)
    return json.loads(json.dumps(hjson_data, indent=4))
