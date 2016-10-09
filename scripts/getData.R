# set the working directory to file directory
# the directory needs to be set manually if the script gets run
# in RStudio instead of being sourced directly
this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)
 
library(RCurl)
url <- ('http://www.stat.cmu.edu/tartandatasciencecup/episodeII/transaction_data_8451.csv')
datafile <- getURI(url)
myData <- read.csv(textConnection(datafile), header=T)
write.csv(myData, file = file.path('../data/rawData.csv'))

url <- ('www.stat.cmu.edu/tartandatasciencecup/episodeII/team_name.csv')
datafile <- getURI(url)
myData <- read.csv(textConnection(datafile), header=T)
nrow(predictions)

(unique(finalData$household_key))
predictions <- read.csv('../predictions.csv', header = FALSE)