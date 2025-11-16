import json

def generate_markdown(api_spec):
    markdown = "# API Documentation\n\n"
    markdown += "## Endpoints\n\n"

    for path, methods in api_spec.get("paths", {{}}).items():
        for method, details in methods.items():
            markdown += f"### `{method.upper()} {path}`\n\n"
            
            if "summary" in details:
                markdown += f"- **Summary:** {details['summary']}\n"
            
            if "description" in details:
                markdown += f"- **Description:** {details['description']}\n"

            if "requestBody" in details:
                content = details["requestBody"].get("content", {{}})
                if "application/json" in content:
                    schema_ref = content["application/json"]["schema"].get("$ref")
                    if schema_ref:
                        schema_name = schema_ref.split("/")[-1]
                        markdown += f"- **Request Body:** `{schema_name}`\n"

            if "responses" in details:
                markdown += "- **Responses:**\n"
                for code, resp_details in details["responses"].items():
                    markdown += f"  - `{code}`: {resp_details['description']}\n"
            
            markdown += "\n"

    markdown += "## Schemas\n\n"
    for name, schema in api_spec.get("components", {{}}).get("schemas", {{}}).items():
        markdown += f"### `{name}`\n\n"
        if "properties" in schema:
            markdown += "| Field | Type | Required |\n"
            markdown += "|---|---|---|
"
            required_fields = schema.get("required", [])
            for prop_name, prop_details in schema["properties"].items():
                prop_type = prop_details.get("type", "object")
                is_required = "Yes" if prop_name in required_fields else "No"
                markdown += f"| {prop_name} | {prop_type} | {is_required} |\n"
        markdown += "\n"

    return markdown

if __name__ == "__main__":
    with open("openapi.json") as f:
        api_spec = json.load(f)
    
    markdown_doc = generate_markdown(api_spec)
    
    with open("API_DOCUMENTATION.md", "w") as f:
        f.write(markdown_doc)