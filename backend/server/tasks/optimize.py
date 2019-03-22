from server.optimizer import prep_data, optimize


def do_task_optimize(tickers, start_date, end_date, interval='weekly'):
    data = prep_data.get_data(tickers, start_date, end_date, interval)
    transformed_data = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()
    # TODO save to mongo
    print([res.as_dict() for res in results])
    return 'success for' + str(tickers)
