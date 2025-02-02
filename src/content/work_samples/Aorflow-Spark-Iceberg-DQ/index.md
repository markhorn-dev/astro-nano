---
title: "WAP pattern with Airflow, Spark, and Iceberg."
description: "Write-Audit-Publish (WAP) using spark, Iceberg, MinIO, Nessie catalog, Soda, and dbt "
date: "Oct 17 2024"
demoURL: "https://astro-nano-demo.vercel.app"
repoURL: "https://github.com/markhorn-dev/astro-nano"
---

![data quality using Nessie catalog, MinIO, mc, dbt, Soda, Airflow, Spark, and Iceberg](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/project_overview.png)
# Disclaimer
The configurations provided in this project are for **demonstration purposes only**. They should not be used in a production environment. **I do not take responsibility for any failures, issues, or consequences that may arise from using these settings in a production setup.**
# Table of Contents
- [Project Overview](#project-overview)
  - [Objectives](#objectives)
  - [Introduction](#introduction)
  - [Airflow](#airflow)
  - [Nessie Branching](#nessie-branching)
  - [dbt-core Tests vs SODA-core](#dbt-core-tests-vs-soda-core)
- [Set Up the Project](#set-up-the-project)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
- [Troubleshooting](#troubleshooting)
  - [Ingestion Failure](#ingestion-failure)
  - [Transformation DAG (dbt-core[PyHive])](#transformation-dag-dbt-corepyhive)
- [Airflow Data-Aware DAGs](#airflow-data-aware-dags)
  - [Branching and Ingestion Layer DAG (Bronze)](#branching-and-ingestion-layer-dag-bronze)
  - [Cleaning Layer DAG (Silver)](#cleaning-layer-dag-silver)
  - [Transformation Layer DAG (Gold)](#transformation-layer-dag-gold)
  - [Publish and Move Raw CSVs DAG](#publish-and-move-raw-csvs-dag)
  - [Error Handling DAG](#error-handling-dag)
  - [Re-ingest DAG](#re-ingest-dag)
- [Connections](#connections)
- [Project Directory Structure](#project-directory-structure)
- [Contribution](#contribution)

# Project Overview
## Objectives

- **Data Quality:** Implement automated data quality checks and validation.
- **Version Control:** Manage data versions with Nessie and ensure reproducibility.
- **Data Management:** Use MinIO for storage and mc for management.
- **Data Transformation:** Process data with Spark and manage tables with Iceberg.
- **Data Validation:** Monitor data quality with Soda.
- **Workflow Orchestration:** Orchestrate workflows with Airflow.
- **Transformation Management:** Transform and model data with dbt.

## Introduction
This project focuses on data quality management within a modern data ecosystem by integrating technologies such as `Nessie Catalog`, `MinIO`, `SSH`, `dbt-core[PyHive]`, `Soda-core-spark-df`, `Apache Airflow` (with data-aware DAGs), `Apache Spark`, and `Iceberg`.

The data lakehouse architecture consists of three main layers:

- **Raw (MinIO bucket):** Stores incoming raw CSV data.
- **Bronze:** Holds raw data loaded into Iceberg tables.
- **Silver:** Contains cleaned, analysis-ready datasets for machine learning and reporting.
- **Gold:** Houses the dimensional representations of the cleaned data, typically for analytical and business intelligence purposes.

### Airflow
The ELT process is broken down into smaller, more manageable units called DAGs. Each DAG handles a specific part of the overall workflow, such as data extraction, transformation, or loading. This modular approach allows for greater flexibility, letting you develop, monitor, and troubleshoot individual stages of the pipeline separately, without affecting the whole process.
>![Airflow Dependency Graph | Data-Aware Scheduling](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/workflow/dep-graph.png)                              
>Airflow’s [datasets feature](https://www.astronomer.io/docs/learn/airflow-datasets) helps orchestrate these DAGs based on the data flow between them. Instead of setting up hard-coded task dependencies, datasets allow Airflow to trigger tasks dynamically when certain datasets are updated. For example, when a new file is ingested or a table is updated, Airflow detects this change and can automatically trigger the appropriate downstream DAGs. This makes the pipeline more scalable and adaptive, especially as the data ecosystem grows and new dependencies or datasets are added.

### Nessie Branching
For each new file that gets ingested, Airflow automatically creates a new branch in the Nessie catalog. This allows you to isolate the processing of that specific file without affecting the main dataset. Think of it as a sandbox where the file is validated, cleaned, and transformed without any risk to the core data.

If the ELT process runs successfully—meaning the file is fully processed and passes all validations—the changes made on the new branch are merged back into the main branch. This ensures only clean, verified data makes it into the central dataset. However, if the process encounters any issues (e.g., data quality checks fail or transformations break), the branch isn’t merged, and the CSV is rejected. This prevents bad data from corrupting the main dataset, maintaining data integrity while keeping each step traceable.


> Nessie doesn’t replicate data in the data lake when creating branches—it simply manipulates metadata. [More about Nessie](https://projectnessie.org/guides/about/).

### dbt-core tests vs SODA-core
In this project, Soda Core and dbt Core serve complementary roles in validating the quality of the data before it reaches the gold layer (the warehouse). Here's how they compare:

**Soda Core** is used to ensure that the ingested and cleaned data meets business and technical requirements. It focuses on monitoring data health by running quality checks such as data completeness, freshness, and consistency. These tests ensure that the data is ready for downstream processes and qualified to be loaded into the gold layer of the warehouse.

On the other hand, **dbt-core** tests are tightly integrated into the transformation layer. They validate the integrity and structure of the data models created during the transformation process. Common dbt tests include ensuring unique values, checking for null constraints, and validating referential integrity in the context of building dimensional models and fact tables.

# Set Up the Project

## Prerequisites

- **Linux:** Debian-based distribution.
- **Docker:** Ensure Docker is installed and running.
- **Python:** Version 3.8 or higher.

## Environment Setup

The `run.sh` script initializes Docker Compose, copies raw data to MinIO, sets up Airflow and connections, and starts the Spark Thrift server.
```bash
#Work Directory: Data-Quality-with-Nessie
echo -e "AIRFLOW_UID=$(id -u)" > .env
. ./shell-scripts/run.sh
```


# Troubleshooting
## Ingestion Failure

**Reason 1 - MinIO IP**
- Inspect the MinIO IP in the `BigData` network and verify it in `./conf/minio.env`.

**Reason 2 - Network Issues**
- Ensure MinIO, Airflow, and Spark are on the same network.

**Reason 3 - Spark SSH Issues**
- Verify Airflow SSH connection configurations and test them.
- Ensure the `extra` field is correct:
```json
{
  "AWS_ACCESS_KEY_ID": "admin",
  "AWS_SECRET_ACCESS_KEY": "password",
  "AWS_REGION": "us-east-1",
  "AWS_DEFAULT_REGION": "us-east-1"
}
```

**Reason 4 - AWS Issues**
- Check Airflow SSH connection configurations and test them.
- Ensure the `extra` field is correct:
```json
{
  "aws_access_key_id": "admin",
  "aws_secret_access_key": "password",
  "endpoint_url": "http://minio:9000"
}
// NOTE: CONNECTION TEST MAY SHOW ERROR; IGNORE IT AND RE-TRIGGER THE INGESTION DAG
```

**Reason 5 - Spark Initialization Job Error**
- Check logs at `bash-logs/0-init_job.log` for errors. If present, re-run the initialization job:
```bash
docker exec spark spark-submit /spark-container/spark/jobs/init_project.py > bash-logs/0-init_job.log
```


## Transformation DAG (dbt-core[PyHive])

If dbt transformations fail, manually launch the Thrift server:

```bash
docker exec spark sh spark-container/ThriftServer-Iceberg-Nessie.sh
```
If dbt couldn't access the database via thrift connection, check `thrift_sasl` python library. 
``` bash
# check if exists 
pip show thrift_sasl

# install it if doesn't exists
pip install thrift_sasl
```

# Airflow Data-Aware DAGs
## Branching and Ingestion layer DAG (Bronze)
![ingestion and defining nessie branch](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/start_ingestion.png)
- This DAG ingests Amazon order data from a CSV stored in an S3-compatible MinIO bucket into a Spark-based data processing pipeline. 
- The pipeline validates the data with Soda checks and updates ingestion metadata on success or failure. 
- It leverages version control via Nessie to create a new branch for each ingestion batch.
### Limitations
Due to the reliance on environment variables for data sharing between DAGs, it is not feasible to run the workflow concurrently. This limitation arises from potential conflicts when sharing Nessie branch names and other environment-specific variables across multiple parallel runs.

As a temporary solution, both this ingestion DAG and the related transformation DAGs are configured to run in a pool with only one slot. This setup ensures that only one instance of the DAG can run at any given time, preventing race conditions or data inconsistencies caused by parallel execution.

## Cleaning layer DAG (Silver)
![clean and audit](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/cleaning.png)
- This DAG cleans and audits ingested Amazon order data and loads it into the silver layer of a data lake using Spark. 
- It triggers based on the successful ingestion of data and performs data validation using Soda checks, followed by updating relevant datasets based on success or failure.

A code block demonistrates data cleansing in this project from `./spark-container/spark/jobs/cleansing.py`
``` python
    clean_df = df.withColumn('Order_Date', to_date(df.Order_Date, format='MM-dd-yy')) \
        .dropna(subset=['Size', 'Qty', 'Amount', 'Order_ID', 'Order_Date', 'Currency']) \
        .filter( (col('Qty') > 0) & (col('Amount') > 0) ) \
        .fillna({
            "Order_Status"          :   "INVALID_VALUE",
            "Fulfilment"            :   "INVALID_VALUE",
            "ORDERS_Channel"        :   "INVALID_VALUE",
            "ship_service_level"    :   "INVALID_VALUE",
            "Category"              :   "INVALID_VALUE",
            "Courier_Status"        :   "INVALID_VALUE",
            "Ship_City"             :   "INVALID_VALUE",
            "Ship_State"            :   "INVALID_VALUE",
            "Ship_Postal_Code"      :   "INVALID_VALUE",
            "Ship_Country"          :   "INVALID_VALUE",
            "Fulfilled_By"          :   "INVALID_VALUE",
            "New"                   :   "INVALID_VALUE",
            "PendingS"              :   "INVALID_VALUE",
        }) \
        .drop_duplicates(subset=['Order_ID', 'Category', 'Order_Date', 'Amount']) 
    
    # before loading, we need to check spelling for some columns
    # picking up columns that has determined values
    # such as: size, status, category, etc
    # this stage should discover if there any typos in these columns
    
    target_col_names = [
        "Order_Status",
        "Fulfilment",
        "ORDERS_Channel",
        "ship_service_level",
        "Category",
        "Size",
        "Courier_Status",
        "Currency",
        "Ship_City",
        "Ship_State",
        "Ship_Country",
        "Fulfilled_By",
        "New",
    ]

    from pyspark.sql.functions import pandas_udf, col
    from pyspark.sql.types import StringType
    import pandas as pd # type: ignore
    from autocorrect import Speller # type: ignore

    spell = Speller()
    @pandas_udf(StringType())
    def correct_string_spelling_udf(string: pd.Series) -> pd.Series:
        return string.apply(lambda x: str(spell(x)) if x else x)

    @pandas_udf(StringType())
    def standarize_string_udf(sentence: pd.Series) -> pd.Series:
        return sentence.apply(lambda x: x.capitalize().strip() if x else x)

    # Apply the UDFs to the DataFrame columns
    for column in target_col_names:
        clean_df = clean_df \
                    .withColumn(column, standarize_string_udf(col(column))) \
                    .withColumn(column, correct_string_spelling_udf(col(column)))
  ```  
## Transformation layer DAG (Gold)
![dbt transformation and testing](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/transform.png)
- This DAG is responsible for transforming Amazon order data from the silver layer to the gold layer using dbt (Data Build Tool). 
- It processes source, dimension, and fact models in parallel, with tests after each transformation. 
- The workflow updates success or failure datasets depending on the outcome of the dbt transformations.
### dbt models structure
``` plaintext
├── dims
│   ├── currency_dim.sql
│   ├── date_dim.sql
│   ├── location_dim.sql
│   ├── product_dim.sql
│   └── shipping_dim.sql
├── facts
│   └── fact_amazon_orders.sql
└── sources
    ├── amazon_orders_silver.sql
    └── src_amazon_orders_silver.yml
```

## Publish and Move Raw CSVs DAG
![publish](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/publish.png)
- This DAG is responsible for publishing transformed datasets by merging them into the main table using Spark, 
- then moving processed CSV files from a "queued" to a "processed" S3 bucket. 
- Finally, the DAG updates success or failure datasets based on the outcome.
  

## Error Handeling DAG
![ELT error handeling](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/error-handling.png)
- This DAG moves rejected CSV files to a rejected_csv folder in an S3 bucket whenever a failure occurs during data ingestion, cleaning, transformation, or publishing. 
- It updates relevant success or failure datasets based on the result.
 

## Re-ingest DAG
![re-ingest](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/airflow/dags/re-ingest.png)


# Connections
![how dbt, soda, airflow connects to the data lakehouse](https://github.com/ahmadMuhammadGd/Data-Quality-with-Nessie/raw/main/md_assets/connections.png)
The diagram above illustrates how the various components of the data pipeline interact in this project, showing a Git-like branching structure for data versions using Nessie:
- **White Lines:** AWS SDK connection to access the raw and warehouse buckets.
- **Blue Lines:** Airflow SSH Plugin connection to Spark, managing jobs and interactions through SSH for orchestration.
- **Green Lines:** Nessie branches created during the ELT process, managing metadata in the warehouse, and retriving data lakehouse iceberg tables.
- **Red Lines:** Thrift Server connections to dbt-core using PyHive, enabling Spark SQL transformations and queries.
- **Purple Lines:** Airflow handles the scheduling and coordination of all tasks, ensuring seamless integration between these tools.


# Project Directory-Structure
```plaintext
.
├── airflow
│   ├── airflow-compose.yaml
│   ├── config
│   ├── dags
│   │   ├── 00-ingestion_layer
│   │   │   └── amazon_csv_orders.py
│   │   ├── 01-cleansing_layer
│   │   │   └── amazon_csv_orders.py
│   │   ├── 02-transformation_layer
│   │   │   └── amazon_csv_orders.py
│   │   ├── 03-publish
│   │   │   └── amazon_csv_orders.py
│   │   ├── 10-error_handelings
│   │   │   └── amazon_csv_orders.py
│   │   ├── 11-triggers
│   │   │   └── amazon_csv_orders_ingestion_trigger.py
│   │   └── dynamic.py
│   ├── db
│   │   └── airflow.db
│   ├── dockerfile
│   ├── includes
│   │   ├── data
│   │   │   └── datasets.py
│   │   ├── dbt_projects
│   │   │   └── amazon_orders
│   │   │       ├── analyses
│   │   │       ├── dbt_project.yml
│   │   │       ├── macros
│   │   │       │   └── dim_loaders
│   │   │       │       ├── date_scd_0.sql
│   │   │       │       └── scd_0.sql
│   │   │       ├── models
│   │   │       │   ├── dims
│   │   │       │   │   ├── currency_dim.sql
│   │   │       │   │   ├── date_dim.sql
│   │   │       │   │   ├── location_dim.sql
│   │   │       │   │   ├── product_dim.sql
│   │   │       │   │   └── shipping_dim.sql
│   │   │       │   ├── facts
│   │   │       │   │   └── fact_amazon_orders.sql
│   │   │       │   └── sources
│   │   │       │       ├── amazon_orders_silver.sql
│   │   │       │       └── src_amazon_orders_silver.yml
│   │   │       ├── README.md
│   │   │       ├── seeds
│   │   │       ├── snapshots
│   │   │       └── tests
│   │   │           ├── dim_tests.yml
│   │   │           └── fact_tests.yml
│   │   └── pools
│   │       └── pools.py
│   ├── plugins
│   │   └── operators
│   │       ├── sparkSSH.md
│   │       └── sparkSSH.py
│   ├── profiles.yml
│   └── requirements.txt
├── config
│   ├── dremio.env
│   ├── dwh.env
│   ├── env_loader.py
│   ├── minio.env
│   ├── nessie.env
│   └── paths.env
├── data
│   └── original_dataset
│       ├── Amazon Sale Report.csv
│       ├── batchs
│       │   ├── sampled_data_1.csv
│       │   ├── sampled_data_2.csv
│       │   ├── sampled_data_3.csv
│       │   └── sampled_data_4.csv
│       ├── README.md
│       └── sampler.py
├── docker-compose.yaml
├── dockerfiles
│   └── spark
│       ├── dockerfile
│       ├── entrypoint.sh
│       └── requirements.txt
├── LICENSE
├── md_assets
│   ├── airflow
│   │   ├── dags
│   │   │   ├── cleaning.png
│   │   │   ├── error-handling.png
│   │   │   ├── publish.png
│   │   │   ├── re-ingest.png
│   │   │   ├── start_ingestion.png
│   │   │   └── transform.png
│   │   └── workflow
│   │       └── dep-graph.png
│   ├── connections.png
│   └── project_overview.png
├── README.md
├── requirements.txt
├── shell-scripts
│   ├── run.sh
│   └── setup
│       ├── airflow-setup.sh
│       └── minio-setup.sh
└── spark-container
    ├── jinja-templates
    │   └── amazon_orders
    │       └── lakehouse-init.sql
    ├── modules
    │   └── SparkIcebergNessieMinIO
    │       ├── CustomSparkConfig.py
    │       └── spark_setup.py
    ├── soda
    │   ├── checks
    │   │   ├── bronz_amazon_orders.py
    │   │   └── silver_amazon_orders.py
    │   ├── modules
    │   │   └── soda
    │   │       └── helper.py
    │   └── tables
    │       ├── bronze_amazon_orders.yaml
    │       └── silver_amazon_orders.yaml
    ├── spark
    │   └── jobs
    │       ├── cleansing.py
    │       ├── ingest.py
    │       ├── init_project.py
    │       ├── load.py
    │       └── merge_into_main.py
    └── ThriftServer-Iceberg-Nessie.sh

51 directories, 76 files
```

## Contribution

Contributions to this project are highly welcomed and greatly appreciated. If you would like to contribute, please adhere to the following guidelines:

1. **Fork the Repository:** Start by forking the repository to create your own copy where you can make changes without affecting the original project.
2. **Create a Branch:** Before making changes, create a new branch with a descriptive name related to the feature or fix you're working on.
3. **Make Your Changes:** Implement your changes or additions, ensuring to follow the existing code style and standards. If you’re adding a new feature, please include corresponding tests and documentation.
4. **Submit a Pull Request:** Once your changes are ready, submit a pull request detailing what you have done. Be sure to explain the purpose of your changes and how they improve the project.
5. **Review Process:** Your pull request will be reviewed by project maintainers. Feedback may be provided, and you may need to make additional changes before your pull request is merged.

We value the contributions and strive to incorporate valuable enhancements and fixes. For any significant changes, please open an issue first to discuss your ideas and get feedback from the community before proceeding. Thank you for your interest and support in improving this!