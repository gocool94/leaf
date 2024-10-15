import pandas as pd
import json
import numpy as np
import sys
import os

def generate_kpi_json(data_kpis, data_usecases):
    result = []
    grouped_kpis = data_kpis.groupby(['DOMAIN', 'INDUSTRY', 'CLASSIFICATION', 'DEPARTMENT', 'SUBDEPARTMENT'])
    usecase_dict = {}

    for _, row in data_usecases.iterrows():
        key = (row['DOMAIN'], row['INDUSTRY'], row['SECTOR'], row['DEPARTMENT'], row['SUBDEPARTMENT'])
        usecase_entry = {
            "usecase": row['USECASE'],
            "definitions": row['DEFINITIONS'],
            "description": row['DESCRIPTION'],
            "business_impact": row['BUSINESS_IMPACT']
        }
        if key in usecase_dict:
            usecase_dict[key].append(usecase_entry)
        else:
            usecase_dict[key] = [usecase_entry]

    for (domain, industry, classification, department, subdepartment), group in grouped_kpis:
        kpicollection = []
        for _, row in group.iterrows():
            kpi_item = {
                "kpi": row['KPIS'],
                "explanation": row['EXPLANATION'],
                "formula": row['FORMULA'] if not pd.isna(row['FORMULA']) else None,
                "explanation": row['EXPLANATION'] if not pd.isna(row['EXPLANATION']) else None
            }
            kpicollection.append(kpi_item)

        subdepartment_data = {
            "subdepartment": subdepartment,
            "kpicollection": kpicollection
        }

        key = (domain, industry, row['SECTOR'], department, subdepartment)
        if key in usecase_dict:
            subdepartment_data["usecases"] = usecase_dict[key]
        else:
            subdepartment_data["usecases"] = []

        domain_entry = next((d for d in result if d["domain"] == domain), None)
        if not domain_entry:
            domain_entry = {"domain": domain, "industries": []}
            result.append(domain_entry)

        industry_entry = next((i for i in domain_entry["industries"] if i["industry"] == industry), None)
        if not industry_entry:
            industry_entry = {"industry": industry, "classifications": []}
            domain_entry["industries"].append(industry_entry)

        classification_entry = next((c for c in industry_entry["classifications"] if c["classification"] == classification), None)
        if not classification_entry:
            classification_entry = {"classification": classification, "departments": []}
            industry_entry["classifications"].append(classification_entry)

        department_entry = next((d for d in classification_entry["departments"] if d["department"] == department), None)
        if not department_entry:
            department_entry = {"department": department, "subdepartments": []}
            classification_entry["departments"].append(department_entry)

        department_entry["subdepartments"].append(subdepartment_data)

    return result

def excel_to_json(excel_file, output_file):
    try:
        xls = pd.ExcelFile(excel_file)
        result = []

        for sheet_name in xls.sheet_names:
            if "KPI" in sheet_name:
                df_kpis = pd.read_excel(xls, sheet_name=sheet_name)
                df_kpis.columns = df_kpis.columns.str.strip()
                df_kpis.replace({np.nan: None}, inplace=True)

                usecase_sheet_name = sheet_name.replace("KPI", "USECASES")
                if usecase_sheet_name in xls.sheet_names:
                    df_usecases = pd.read_excel(xls, sheet_name=usecase_sheet_name)
                    df_usecases.columns = df_usecases.columns.str.strip()

                    kpi_data = generate_kpi_json(df_kpis, df_usecases)
                    result.extend(kpi_data)

        with open(output_file, 'w') as json_file:
            json.dump(result, json_file, indent=4)

        print(f"JSON output successfully created and written to {output_file}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    input_excel = sys.argv[1]  # Excel file path
    output_json = sys.argv[2]  # Output JSON path
    excel_to_json(input_excel, output_json)
