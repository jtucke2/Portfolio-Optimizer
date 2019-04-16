# Financial Portfolio Optimizer
## Jason Tucker

#### AIT 715 Case Study - Towson University - Spring 2019

---

**Getting Started**

1. Copy `.env` to `overrides.env`
2. Enter new values for variables in the "Variables to be overriden in overrides.env" section (Recommended, but not required)
3. `docker-compose up`
4. Navigate to http://localhost
5. Login user the admin credentials from overrides.env

**Common Problems**

* Apache/Nginx on the localhost is not stopped before doing `docker-compose up`
* The `overrides.env` file was not created

**Development Utilities**

1. [Swagger Documentation](http://localhost:5000/swagger)
2. [RabbitMQ Management](http://localhost:15672)
3. [Robo 3T](https://robomongo.org/download) (External)
