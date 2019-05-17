# Airbnb-Estimator

*Team members*: Abraham Villaroman, Kenny Tan and Haojin Li

## Project Theme
The theme of this project is to create a web application that estimates the daily rent of an Airbnb home. To specify, we intend to analyze datasets from airbnb between January_2017 - December_2018 

## Datasets
* [Airbnb NYC data](http://insideairbnb.com/get-the-data.html)

## Dependency 
* Python 3.6.6
* AWS-Sagemaker

## DISCLAIMER
* Since we are using Git lfs we can only have up to 2gb of store, but our datasets exceed 2gb so ignore running the [airbnb_cleaned_seasonality](https://github.com/TanKenny/AirbnbEstimator/tree/master/airbnb_cleaned_seasonality) and run the rest.
* Each jupyter notebook is running on 1 seasonality (spring, summer, fall, winter) change the respective dataset to the respective season for different results. 

## Backend Stack:
    * mongoDB as our database
    * AWS lambda to create serverless REST API
 


## Note
* Review data files were too large and surpassed git lfs limitations so they were not uploaded
