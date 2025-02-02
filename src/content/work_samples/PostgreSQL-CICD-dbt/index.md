---
title: "PostgreSQL, dbt, Data Modeling, and CI/CD"
description: "A quick example that demonstrates how to implement unittests, data tests, and CI/CD using dbt and Github Actions."
date: "Nov 24 2024"
repoURL: "https://github.com/ahmadMuhammadGd/northwind-dbt"
---



![ci/cd pipeline with dbt data pipeline](https://github.com/ahmadMuhammadGd/northwind-dbt/raw/main/readme_assets/Hero.png)



> **DISCLAIMER:** This project uses [northwind](https://docs.yugabyte.com/preview/sample-data/northwind/) as source data, which is a publicly avaiable dataset.  


-----


# 🤓 What is special about this?

- **Unit tests 📑**: Quality `data tests`, and `unit tests` to simulate business scenarious.            

- **Data Tests 📑**: Simple, but save these errors in a seperate table to curate them later.

- **Models Versioning ✨**: Two versioned models, `stg_inventory` and `fact_inventory`.

- **CI/CD 👾**: Initialize test-environment, build models, run models in `incremental_mode`, run `data tests`, and run `unit tests` in isolated environment before merging into `main` branch - using `Github Actions`.

- **Enforced Schema ✊**: Prevents unexpected `data quality` issues caused by changes in the source schema.

- **Slowly Chaning Dimension (SCD) type 2 🐢**: Products SCD but with old way.




# 🤔 Project Objectives
This project aims to craft a modern data warehouse solution that:
- 🤖 Track `orders` by `product`, `cateory` and `location`.  
- 🤖 Track `product price chaneges effect on orders`.
- 🤖 Track `Inventory` data to conduct Safety stock analysis in the future.


-----


# ERD

This is how I modeled the data—guided by **Ralph Kimball’s principles** in **The Data Warehouse Toolkit** 📖.


```mermaid
erDiagram
    fact_inventory ||--o{ dim_products: "stores"
    fact_inventory ||--o{ dim_suppliers: "supplied_by"
    fact_inventory ||--o{ dim_date: "recorded_at"
    fact_orders ||--o{ dim_location: "ordered_from"
    fact_orders ||--o{ dim_products: "ordered_what"
    fact_orders ||--o{ dim_date: "ordered_at"

    fact_orders {
        transaction_sk  text    PK
        order_sk        int
        order_id        int
        order_date      date
        required_date   date
        order_status    varchar
        shipped_date    date
        location_sk     text
        product_sk      text
        unit_price      numeric
        quantity        int
        discount        numeric
    }

    fact_inventory {
        record_id	    text        PK
        product_sk	    text        FK
        supplier_sk	    text        FK
        units_in_stock	integer
        units_on_order	integer
        reorder_level	integer
        updated_at	    timestamp
    }

    dim_products {
        product_sk	        text        PK
        product_id	        integer     
        product_name	    text
        category_name	    charactervarying
        unit_price	        numeric
        quantity_per_unit	charactervarying
        start_date	        date
        end_date	        date
        is_active	        boolean
        valid_days	        integer
    }

    dim_location {
        location_sk	    text    PK
        address	        text
        city	        text
        region	        text
        postal_code	    text
        country	        text
    }


    dim_suppliers{
        supplier_sk     text     PK
        supplier_id     int
        company_name    text                
        contact_name    text                
        contact_title   text                
        location_sk     text                
        phone       	charactervarying                
        fax     	    charactervarying                
        homepage        text                
    }

    dim_date {
        date_day                        date    PK
        prior_date_day                  date
        next_date_day                   date
        prior_year_date_day             date
        prior_year_over_year_date_day   date
        day_of_week                     integer
        day_of_week_name                text
        day_of_week_name_short          text
        day_of_month                    int
        day_of_year                     int
        week_start_date                 date
        week_end_date                   date
        prior_year_week_start_date      date
        prior_year_week_end_date        date
        week_of_year                    integer
        iso_week_start_date             date
        iso_week_end_date               date
        prior_year_iso_week_start_date  date
        prior_year_iso_week_end_date    date
        iso_week_of_year                integer
        prior_year_week_of_year         integer
        prior_year_iso_week_of_year     integer
        month_of_year                   integer
        month_name                      text
        month_name_short                text
        month_start_date                date
        month_end_date                  date
        prior_year_month_start_date     date
        prior_year_month_end_date       date
        quarter_of_year                 integer
        quarter_start_date              date
        quarter_end_date                date
        year_number                     integer
        year_start_date                 date
        year_end_date                   date
    }
```

-----

# 🤯 Data Lineage


Notice that `fact_inventory` has two versions. The first version uses source **snapshots** as an upstream model for its pipeline. On the other hand, in the second version, I realized that the **snapshot** step was unnecessary, so we removed it, resulting in two new models: `stg_inventory.v2` and `fact_inventory.v2`.


![dbt dag](https://github.com/ahmadMuhammadGd/northwind-dbt/raw/main/readme_assets/dbt-dag.png)


-----

# 🏃 Run GitHub Workflow Offline Using act 🎬

With the help of the act tool, you can run and test your GitHub workflows locally using Docker. This allows you to catch issues before pushing changes to the remote repository.

> Check `.github/workflows`

To run a workflow locally and simulate a pull_request event, use the following command:

```sh
# Using act to run a GitHub workflow locally
# Secrets are stored in the .secrets file (create it yourself with required values)
act -P ubuntu-20.04=catthehacker/ubuntu:act-20.04 pull_request --secret-file .secrets --pull=false
```
- **act:** The CLI tool that simulates GitHub Actions workflows locally.

- **-P ubuntu-20.04=catthehacker/ubuntu:act-20.04:** Specifies the Docker image to use. We're using an Ubuntu 20.04 image provided by act.

- **pull_request:** Specifies the event type that will trigger the workflow.

- **--secret-file:** .secrets: Points to a file containing secret values for environment variables.

- **--pull=false**: Prevents act from automatically pulling the latest image (useful if you want to avoid an unnecessary download).

-----

# 📚 Resources
- [📑 dbt Unit Tests](https://docs.getdbt.com/docs/build/unit-tests)
- [🔧 dbt Model Versioning](https://docs.getdbt.com/docs/collaborate/govern/model-versions)
- [🔨 Test Driven Development (TDD) in Software Engineering](https://en.wikipedia.org/wiki/Test-driven_development)
- [🤔 Unit Tests 🆚 Integrations Tests](https://stackoverflow.com/questions/5357601/whats-the-difference-between-unit-tests-and-integration-tests)
- [🎬 act Documentation](https://nektosact.com/introduction.html)
