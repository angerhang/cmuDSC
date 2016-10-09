weekData <- read.csv('../data/weekData.csv')

sample()
# use day to spilt the data set
# 70 % training 20% test % 10% validation
train <- 
test <- 
validation <- 
  
(sample())

N <- 200
trainN <- N * 0.7
testN <- N * 0.2
validN <- N - trainN - testN
a <- sample(c(rep(1, trainN), rep(2, testN), rep(3, validN)))
