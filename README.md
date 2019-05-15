# Portfolio Optimizer

Automated adjustment of assets weights to yield the optimum risk adjusted returns of a portfolio.

## Getting Started

1. Copy `.env` to `overrides.env`
2. Enter new values for variables in the "Variables to be overriden in overrides.env" section (Recommended, but not required)
3. `docker-compose up` or `sudo docker-compose up`
4. Navigate to https://localhost
5. Login using the admin credentials from overrides.env

#### Common Problems Getting Started

* Apache/Nginx on the localhost is not stopped before doing `docker-compose up`
* The `overrides.env` file was not created

#### Development Utilities

1. [Swagger Documentation](http://localhost:5000/swagger)
2. [RabbitMQ Management](http://localhost:15672)
3. [Robo 3T](https://robomongo.org/download) (External)

## User Management

#### User Roles

* Standard User: Can create, view, and publish portfolios
* Admin: ++ Access the Admin dashboard

#### User Approval Process

* User completes registration
* If a user attempts to login before being approved, he/she is notified that he/she is pending approval
* Admin goes to Admin dashboard, approves or denies users
* Admins can promote anyone else to Admin

## Methodology

Portfolio optimizer uses modern portfolio theory to calculate risk adjusted returns of portfolios.  It optimizes the weights of assets in the portfolios to achieve certain objectives (eg, Max Sharpe Ratio) using a non-linear optimizer.

All portfolios created by the optimizer will provide additional statistics calculated against a user defined benchmark index, such as alpha and beta vs the S&P 500.

---

This is a project for AIT 715 at Towson University, Maryland, USA.

&copy; 2019 Jason Tucker
