from server.db.connect import portfolios_col


def insert_job(job) -> str:
    result = portfolios_col.insert_one(job)
    return str(result.inserted_id)
