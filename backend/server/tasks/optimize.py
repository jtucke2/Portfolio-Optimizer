from server.optimizer import prep_data, optimize
from server.db.portfolios import insert_job
from datetime import datetime


def do_task_optimize(name, tickers, start_date, end_date, user_id, task_id, interval='weekly'):
    job_start = datetime.now()
    data = prep_data.get_data(tickers, start_date, end_date, interval)
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()
    job_end = datetime.now()
    job = {
        'job_start': job_start,
        'job_end': job_end,
        'std_dev_vec': matrices.std_dev_vec.tolist(),
        'avg_returns_vec': matrices.avg_returns_vec.tolist(),
        'correlation_matrix': matrices.correlation_matrix.tolist(),
        'price_dates': dates,
        'parameters': {
            'tickers': tickers,
            'start_date': start_date,
            'end_date': end_date,
            'interval': interval
        },
        'results': [res.as_dict() for res in results],
        'user_id': user_id,
        'task_id': task_id,
        'published': False,
        'name': name
    }
    return insert_job(job)
