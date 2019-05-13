from server.optimizer import prep_data, optimize
from server.db.portfolios import insert_job
from datetime import datetime

from server.optimizer.returns import PortfolioReturns


def do_task_optimize(name, tickers, benchmark_index: str, start_date, end_date, user_id, task_id, interval='weekly'):
    job_start = datetime.now()

    # Get & prepare portfolio data
    data = prep_data.get_data(tickers, start_date, end_date, interval)
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)

    # Get benchmark data
    benchmark_data = prep_data.get_data(benchmark_index, start_date, end_date, interval)
    benchmark_transformed_data, _ = prep_data.transform_yahoo_finance_dict(benchmark_data)
    benchmark_asset_data = prep_data.generate_asset_data_array(benchmark_transformed_data)
    benchmark_returns = PortfolioReturns(benchmark_asset_data)

    # Optimize portfolio
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices, benchmark_asset_data[0])
    results = optimizer.optimize_all()

    job_end = datetime.now()

    job = {
        'job_start': job_start,
        'job_end': job_end,
        'asset_data': [a.as_dict() for a in asset_data],
        'matrices': matrices.as_dict(),
        'price_dates': dates,
        'parameters': {
            'tickers': tickers,
            'start_date': start_date,
            'end_date': end_date,
            'interval': interval
        },
        'benchmark_index': {
            'asset_data': benchmark_asset_data[0].as_dict(),
            'returns': benchmark_returns.as_dict()
        },
        'results': [res.as_dict() for res in results],
        'user_id': user_id,
        'task_id': task_id,
        'published': False,
        'name': name
    }
    return insert_job(job)
