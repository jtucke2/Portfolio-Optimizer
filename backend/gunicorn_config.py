from multiprocessing import cpu_count
cpu_count_result = cpu_count()

bind = '0.0.0.0:5000'
workers = 4 if cpu_count_result >= 4 else cpu_count_result
print(f'Starting server on {bind} with {workers} workers')
