# Given row data per day, create row data per weeks
# Sums the columns: QUANTITY, BASE_SPEND_AMT, LOY_CARD_DISC, 
#                   COUPON_DISC, NET_SPEND_AMT 
# String appends the columns: PRODUCT_ID, DEPARTMENT, COMMODITY_DESC
#                             SUB_COMMODITY_DESC, PRICE_PER_PRODUCT
# Places the following metadata: household_key, AGE_DESC, MARITAL_STATUS_CODE,
#                                INCOME_DESC, HOMEOWNER_DESC, HH_COMP_DESC,
#                                HOUSEHOLD_SIZE_DESC, KID_CATEGORY_DESC
ROW_DATA_DIR = '../data/cleanData.csv' 
OUTPUT_DIR = '../data/weekData.csv'

if __name__ == '__main__':
    with open(ROW_DATA_DIR, 'r') as fin:
        with open(OUTPUT_DIR, 'w') as fout:
            lines = fin.readlines()
            lines = [line.strip() for line in lines]
            data = [line.split(',') for line in lines]
            header = data[0]
            data = data[1:]
            print_header = '"","X","household_key","WEEK","QUANTITY","BASE_SPEND_AMT",'
            print_header += '"LOY_CARD_DISC","COUPON_DISC","NET_SPEND_AMT","PRODUCT_ID",'
            print_header += '"DEPARTMENT","COMMODITY_DESC","SUB_COMMODITY_DESC", "PRICE_PER_PRODUCT",'
            print_header += '"AGE_DESC","MARITAL_STATUS_CODE","INCOME_DESC","HOMEOWNER_DESC",'
            print_header += '"HH_COMP_DESC","HOUSEHOLD_SIZE_DESC","KID_CATEGORY_DESC"\n'
            fout.write(print_header)

            # Stores metadata
            households = {}
            # Keeps track of row indexes of days
            counter = 0
            line_indexes = []
            for line in data:
                if int(line[header.index('"DAY"')]) >= len(line_indexes):
                    line_indexes.append(counter)
                else: 
                    line_indexes[int(line[header.index('"DAY"')])] = counter
                counter += 1
                if not line[header.index('"household_key"')] in households:
                    metadata = []
                    metadata.append(line[header.index('"AGE_DESC"')])
                    metadata.append(line[header.index('"MARITAL_STATUS_CODE"')])
                    metadata.append(line[header.index('"INCOME_DESC"')])
                    metadata.append(line[header.index('"HOMEOWNER_DESC"')])
                    metadata.append(line[header.index('"HH_COMP_DESC"')])
                    metadata.append(line[header.index('"HOUSEHOLD_SIZE_DESC"')])
                    metadata.append(line[header.index('"KID_CATEGORY_DESC"')])
                    households[line[header.index('"household_key"')]] = metadata
            
            line_indexes.reverse()
            idx = len(line_indexes) - 1
            rowidx = len(data) - 1
            week = len(line_indexes) / 7 + 1
            printidx = 0
            week_data = {}
            for household in households:
                week_data[household] = [0,0,0,0,0,'','','','','']           
            while rowidx >= 0:
                if (idx < 7 and rowidx == 0) or rowidx == line_indexes[idx-7]:
                    for household in households:
                       toprint = [str(printidx), str(printidx), household, str(week)] + week_data[household] + households[household] 
                       toprint = [str(x) for x in toprint]
                       fout.write(",".join(toprint) + '\n')
                       printidx += 1
                    week = week - 1
                    idx = idx-7
                
                household = data[rowidx][header.index('"household_key"')]
                week_data[household][0] += float(data[rowidx][header.index('"QUANTITY"')])
                week_data[household][1] += float(data[rowidx][header.index('"BASE_SPEND_AMT"')])
                week_data[household][2] += float(data[rowidx][header.index('"LOY_CARD_DISC"')])
                week_data[household][3] += float(data[rowidx][header.index('"COUPON_DISC"')])
                week_data[household][4] += float(data[rowidx][header.index('"NET_SPEND_AMT"')])
                week_data[household][5] += data[rowidx][header.index('"PRODUCT_ID"')] + '|'
                week_data[household][6] += data[rowidx][header.index('"DEPARTMENT"')] + '|'
                week_data[household][7] += data[rowidx][header.index('"COMMODITY_DESC"')] + '|'
                week_data[household][8] += data[rowidx][header.index('"SUB_COMMODITY_DESC"')] + '|'
                week_data[household][9] += data[rowidx][header.index('"PRICE_PER_PRODUCT"')] + '|'
                rowidx = rowidx - 1


            


