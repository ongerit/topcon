'use strict';

$(document).ready(function() {
    var $component = $('.nyl-long-term-care-calc');
    if ($component.length === 0){
        return;
    }

    var $resultTable = $('.nyl-long-term-care-calc__results');
    var resultLabelHTML = document.getElementsByClassName('nyl-long-term-care-calc__table-head')[0].outerHTML;
    var ltcData = [
        ['AK', 'Anchorage, AK ', '$146,518', '$112,424', '$5,395', '$5,511', '$4,985', '$81.74', '$68.75', '$27.89'],
        ['AL', 'Birmingham, AL ', '$86,804', '$77,705', '$3,957', '$4,108', '$3,199', '$49.11', '$41.50', '$19.11'],
        ['AL', 'Huntsville, AL ', '$85,538', '$74,599', '$3,916', '$3,908', '$3,516', '$75.60', '$78.11', '$17.63'],
        ['AL', 'Mobile, AL ', '$79,033', '$74,493', '$4,470', '$3,492', '$3,199', '$105.05', '$103.22', '$20.65'],
        ['AL', 'Montgomery, AL ', '$77,822', '$72,971', '$3,686', '$3,533', '$2,619', '$96.80', '$85.00', '$19.77'],
        ['AR', 'Fayetteville-Springdale-Rogers, AR ', '$71,945', '$64,970', '$3,685', '$3,459', '$3,373', '$81.80', '$65.95', '$20.94'],
        ['AR', 'Little Rock-North Little Rock, AR ', '$73,405', '$63,411', '$4,214', '$4,352', '$4,101', '$112.83', '$94.00', '$19.46'],
        ['AR', 'Memphis, TN-AR-MS ', '$81,716', '$70,511', '$4,360', '$4,548', '$3,784', '$58.17', '$59.61', '$18.88'],
        ['AR', 'Non-Metro: AR ', '$66,988', '$57,831', '$3,884', '$2,795', '$2,694', '$78.10', '$52.64', '$17.87'],
        ['AZ', 'Las Vegas, NV-AZ ', '$88,012', '$78,325', '$4,149', '$3,948', '$3,156', '$90.74', '$86.57', '$22.15'],
        ['AZ', 'Phoenix-Mesa, AZ ', '$112,774', '$90,662', '$4,327', '$4,040', '$3,723', '$92.65', '$75.94', '$21.88'],
        ['AZ', 'Tucson, AZ ', '$97,502', '$78,201', '$4,510', '$4,401', '$3,960', '$73.47', '$57.82', '$21.94'],
        ['AZ', 'Non-Metro: AZ ', '$90,520', '$78,658', '$4,296', '$4,141', '$3,759', '$94.72', '$82.88', '$24.28'],
        ['CA', 'Bakersfield, CA ', '$102,105', '$115,168', '$3,151', '$3,833', '$3,446', '$106.20', '$63.94', '$22.82'],
        ['CA', 'Chico-Paradise, CA ', '$102,156', '$84,206', '$4,245', '$3,850', '$3,505', '$110.28', '$52.25', '$23.13'],
        ['CA', 'Fresno, CA ', '$85,746', '$81,213', '$4,054', '$4,118', '$3,536', '$114.50', '$85.44', '$21.86'],
        ['CA', 'Los Angeles-Riverside-Orange County, CA ', '$126,637', '$98,999', '$4,864', '$4,684', '$4,137', '$91.37', '$63.98', '$22.27'],
        ['CA', 'Modesto, CA ', '$117,895', '$107,219', '$3,403', '$3,499', '$3,310', '$101.50', '$71.25', '$21.88'],
        ['CA', 'Non-Metro: CA ', '$98,649', '$84,738', '$4,325', '$4,073', '$3,429', '$123.62', '$95.96', '$25.42'],
        ['CA', 'Oxnard-Thousand Oaks-Ventura, CA ', '$101,134', '$87,523', '$4,983', '$4,935', '$3,915', '$102.33', '$64.29', '$22.79'],
        ['CA', 'Riverside-San Bernardino-Ontario, CA ', '$130,531', '$94,663', '$3,836', '$4,060', '$3,489', '$94.19', '$74.41', '$21.42'],
        ['CA', 'Sacramento-Yolo, CA ', '$123,556', '$94,739', '$4,206', '$4,474', '$3,995', '$97.45', '$67.65', '$23.35'],
        ['CA', 'Salinas, CA ', '$100,229', '$94,217', '$4,803', '$5,297', '$4,428', '$119.72', '$110.00', '$25.07'],
        ['CA', 'San Diego, CA ', '$128,611', '$95,758', '$4,888', '$4,920', '$3,885', '$81.53', '$46.92', '$23.05'],
        ['CA', 'San Francisco-Oakland-San Jose, CA ', '$151,136', '$114,052', '$5,151', '$5,110', '$4,437', '$118.93', '$94.46', '$25.40'],
        ['CA', 'San Jose-Sunnyvale-Santa Clara, CA ', '$144,996', '$109,182', '$5,313', '$5,719', '$5,115', '$131.28', '$93.42', '$25.57'],
        ['CA', 'San Luis Obispo-Atascadero-Paso Robles, CA ', '$106,763', '$90,440', '$4,998', '$5,454', '$4,374', '$133.33', '$108.13', '$25.04'],
        ['CA', 'Santa Barbara-Santa Maria-Lompoc, CA ', '$145,066', '$113,398', '$4,463', '$5,246', '$4,942', '$84.13', '$87.05', '$27.05'],
        ['CA', 'Santa Rosa, CA ', '$153,201', '$105,419', '$4,817', '$4,925', '$4,000', '$88.43', '$69.20', '$27.57'],
        ['CA', 'Stockton-Lodi, CA ', '$126,604', '$96,929', '$3,576', '$3,852', '$2,967', '$60.00', '$30.00', '$24.79'],
        ['CO', 'Colorado Springs, CO ', '$120,501', '$86,202', '$5,183', '$4,606', '$4,275', '$74.03', '$55.13', '$23.60'],
        ['CO', 'Denver-Boulder-Greeley, CO ', '$127,250', '$95,349', '$5,375', '$4,847', '$4,194', '$78.13', '$64.27', '$23.87'],
        ['CO', 'Fort Collins-Loveland, CO ', '$106,945', '$89,743', '$4,541', '$4,498', '$3,560', '$73.88', '$54.63', '$24.70'],
        ['CO', 'Non-Metro: CO ', '$87,100', '$75,873', '$4,917', '$4,146', '$3,592', '$107.15', '$93.30', '$24.82'],
        ['CT', 'Boston-Worcester-Lawrence, MA-NH-ME-CT ', '$153,676', '$141,313', '$6,587', '$6,030', '$5,331', '$83.69', '$68.99', '$25.65'],
        ['CT', 'Bridgeport-Stamford-Norwalk, CT ', '$181,270', '$166,272', '$7,514', '$6,157', '$5,717', '$83.91', '$58.58', '$25.03'],
        ['CT', 'Hartford, CT ', '$163,111', '$149,719', '$5,826', '$5,309', '$5,303', '$108.04', '$88.06', '$22.85'],
        ['CT', 'New York-Northern New Jersey-Long Island, NY-NJ-CT-PA ', '$150,621', '$137,156', '$7,103', '$6,408', '$5,632', '$88.86', '$60.30', '$22.89'],
        ['DC', 'Washington-Baltimore, DC-MD-VA-WV ', '$135,240', '$119,877', '$6,016', '$5,659', '$4,975', '$77.88', '$53.94', '$21.73'],
        ['DE', 'Philadelphia-Wilmington-Atlantic City, PA-NJ-DE-MD ', '$132,433', '$117,811', '$6,389', '$5,797', '$4,976', '$65.35', '$49.69', '$22.45'],
        ['FL', 'Daytona Beach, FL ', '$105,310', '$92,188', '$3,162', '$3,897', '$3,455', '$66.54', '$47.60', '$20.74'],
        ['FL', 'Fort Myers-Cape Coral, FL ', '$115,917', '$101,601', '$4,695', '$4,007', '$3,267', '$62.09', '$50.87', '$21.27'],
        ['FL', 'Fort Pierce-Port St. Lucie, FL ', '$104,503', '$99,032', '$4,583', '$3,884', '$3,339', '$60.75', '$46.06', '$18.76'],
        ['FL', 'Jacksonville, FL ', '$103,109', '$91,370', '$5,329', '$4,605', '$4,018', '$72.06', '$54.14', '$20.56'],
        ['FL', 'Lakeland-Winter Haven, FL ', '$94,860', '$85,388', '$3,258', '$3,295', '$2,561', '$59.91', '$38.50', '$19.23'],
        ['FL', 'Melbourne-Titusville-Palm Bay, FL ', '$106,208', '$95,101', '$4,227', '$4,053', '$3,971', '$80.96', '$70.58', '$18.99'],
        ['FL', 'Miami-Fort Lauderdale, FL ', '$108,496', '$92,531', '$4,154', '$3,692', '$3,225', '$62.09', '$43.77', '$17.38'],
        ['FL', 'Naples, FL ', '$127,808', '$104,660', '$4,415', '$4,065', '$3,721', '$58.16', '$44.24', '$22.30'],
        ['FL', 'Non-Metro: FL ', '$102,999', '$87,491', '$4,326', '$4,020', '$3,419', '$77.72', '$64.00', '$21.28'],
        ['FL', 'Orlando, FL ', '$117,103', '$98,368', '$4,569', '$4,349', '$3,836', '$64.98', '$49.97', '$19.94'],
        ['FL', 'Sarasota-Bradenton, FL ', '$110,569', '$92,820', '$4,347', '$4,754', '$3,874', '$66.32', '$53.40', '$22.31'],
        ['FL', 'Tampa-St. Petersburg-Clearwater, FL ', '$111,646', '$96,758', '$4,518', '$4,162', '$3,604', '$65.98', '$50.37', '$20.16'],
        ['FL', 'West Palm Beach-Boca Raton, FL ', '$121,695', '$104,938', '$5,045', '$4,745', '$3,935', '$69.91', '$48.00', '$19.16'],
        ['GA', 'Atlanta, GA ', '$83,289', '$75,581', '$4,553', '$4,270', '$3,757', '$64.72', '$53.55', '$19.77'],
        ['GA', 'Augusta-Aiken, GA-SC ', '$85,074', '$77,636', '$3,886', '$3,641', '$3,581', '$59.35', '$44.39', '$18.75'],
        ['GA', 'Chattanooga, TN-GA ', '$101,645', '$77,457', '$3,804', '$3,920', '$3,205', '$65.28', '$58.44', '$21.13'],
        ['GA', 'Macon, GA ', '$81,800', '$71,839', '$2,088', '$2,484', '$2,227', '$67.92', '$54.58', '$18.28'],
        ['GA', 'Non-Metro: GA ', '$76,077', '$72,620', '$3,220', '$3,145', '$3,218', '$73.06', '$65.85', '$18.23'],
        ['GA', 'Savannah, GA ', '$76,935', '$72,657', '$3,679', '$3,782', '$3,138', '$84.61', '$80.25', '$21.03'],
        ['HI', 'Honolulu, HI ', '$133,473', '$116,107', '$5,822', '$5,451', '$4,742', '$70.35', '$46.50', '$25.12'],
        ['IA', 'Cedar Rapids, IA ', '$83,370', '$70,489', '$3,985', '$3,855', '$4,318', '$94.61', '$77.38', '$23.19'],
        ['IA', 'Des Moines, IA ', '$87,071', '$79,869', '$4,312', '$4,136', '$3,670', '$64.20', '$50.88', '$24.31'],
        ['IA', 'Davenport-Moline-Rock Island, IA-IL ', '$85,118', '$74,613', '$4,280', '$3,910', '$3,613', '$113.25', '$106.38', '$28.50'],
        ['IA', 'Non-Metro: IA ', '$71,664', '$64,280', '$3,829', '$3,320', '$3,073', '$120.40', '$105.02', '$28.13'],
        ['IA', 'Omaha, NE-IA ', '$91,341', '$81,621', '$4,888', '$4,389', '$3,899', '$83.08', '$64.09', '$23.81'],
        ['ID', 'Boise City, ID ', '$99,138', '$91,812', '$4,188', '$3,876', '$3,508', '$66.38', '$56.70', '$20.88'],
        ['ID', 'Non-Metro: ID ', '$94,615', '$83,632', '$4,493', '$3,431', '$3,119', '$80.16', '$69.33', '$19.38'],
        ['IL', 'Chicago-Gary-Kenosha, IL-IN-WI ', '$114,409', '$94,283', '$5,653', '$5,295', '$4,615', '$88.49', '$66.45', '$22.76'],
        ['IL', 'Davenport-Moline-Rock Island, IA-IL ', '$85,118', '$74,613', '$4,280', '$3,910', '$3,613', '$113.25', '$106.38', '$28.50'],
        ['IL', 'Non-Metro: IL ', '$73,653', '$62,229', '$3,801', '$3,310', '$2,922', '$75.16', '$74.11', '$21.25'],
        ['IL', 'Peoria-Pekin, IL ', '$90,177', '$78,877', '$5,001', '$4,412', '$4,109', '$85.75', '$82.38', '$19.98'],
        ['IL', 'Springfield, IL ', '$98,875', '$87,582', '$5,450', '$5,169', '$3,804', '$97.21', '$76.30', '$22.97'],
        ['IL', 'St. Louis, MO-IL ', '$80,180', '$68,872', '$4,754', '$4,493', '$3,761', '$67.45', '$54.21', '$21.04'],
        ['IN', 'Chicago-Gary-Kenosha, IL-IN-WI ', '$114,409', '$94,283', '$5,653', '$5,295', '$4,615', '$88.49', '$66.45', '$22.76'],
        ['IN', 'Cincinnati-Hamilton, OH-KY-IN ', '$110,694', '$97,729', '$4,601', '$4,473', '$3,572', '$63.80', '$45.50', '$21.39'],
        ['IN', 'Evansville-Henderson, IN-KY ', '$92,936', '$77,946', '$4,651', '$4,033', '$3,652', '$78.00', '$80.38', '$22.15'],
        ['IN', 'Fort Wayne, IN ', '$102,744', '$81,260', '$4,148', '$3,704', '$3,229', '$88.15', '$77.75', '$21.30'],
        ['IN', 'Indianapolis, IN ', '$112,847', '$85,757', '$4,426', '$3,933', '$3,152', '$87.81', '$72.12', '$20.92'],
        ['IN', 'Louisville, KY-IN ', '$97,623', '$80,282', '$4,867', '$4,340', '$3,425', '$78.61', '$69.28', '$20.34'],
        ['IN', 'Non-Metro: IN ', '$92,068', '$71,124', '$3,979', '$3,661', '$2,821', '$77.16', '$59.43', '$20.77'],
        ['IN', 'South Bend, IN ', '$114,000', '$105,040', '$3,926', '$3,611', '$3,462', '$77.00', '$57.63', '$21.60'],
        ['KS', 'Kansas City, MO-KS ', '$80,771', '$70,248', '$5,372', '$4,400', '$4,256', '$93.84', '$78.88', '$20.48'],
        ['KS', 'Non-Metro: KS ', '$65,083', '$61,276', '$3,931', '$3,600', '$3,121', '$90.25', '$98.15', '$19.76'],
        ['KS', 'Topeka, KS ', '$96,922', '$84,877', '$5,278', '$5,444', '$4,922', '$110.25', '$104.25', '$24.60'],
        ['KS', 'Wichita, KS ', '$78,446', '$67,229', '$5,087', '$4,551', '$3,775', '$84.41', '$68.25', '$25.74'],
        ['KY', 'Cincinnati-Hamilton, OH-KY-IN ', '$110,694', '$97,729', '$4,601', '$4,473', '$3,572', '$63.80', '$45.50', '$21.39'],
        ['KY', 'Evansville-Henderson, IN-KY ', '$92,936', '$77,946', '$4,651', '$4,033', '$3,652', '$78.00', '$80.38', '$22.15'],
        ['KY', 'Lexington, KY ', '$94,148', '$80,023', '$4,952', '$4,654', '$3,960', '$74.60', '$75.82', '$19.87'],
        ['KY', 'Louisville, KY-IN ', '$97,623', '$80,282', '$4,867', '$4,340', '$3,425', '$78.61', '$69.28', '$20.34'],
        ['KY', 'Non-Metro: KY ', '$87,567', '$75,938', '$4,024', '$3,388', '$2,971', '$91.92', '$68.50', '$21.52'],
        ['LA', 'Baton Rouge, LA ', '$75,592', '$73,026', '$3,406', '$3,181', '$3,148', '$80.77', '$76.03', '$17.76'],
        ['LA', 'Lafayette, LA ', '$72,463', '$56,108', '$4,076', '$3,333', '$3,203', '$113.33', '$123.33', '$16.21'],
        ['LA', 'New Orleans, LA ', '$76,281', '$64,061', '$4,037', '$4,307', '$3,679', '$66.96', '$44.35', '$19.00'],
        ['LA', 'Shreveport-Bossier City, LA ', '$62,492', '$60,418', '$3,851', '$2,959', '$2,566', '$104.57', '$86.57', '$16.48'],
        ['MA', 'Boston-Worcester-Lawrence, MA-NH-ME-CT ', '$153,676', '$141,313', '$6,587', '$6,030', '$5,331', '$83.69', '$68.99', '$25.65'],
        ['MA', 'Providence-Fall River-Warwick, RI-MA ', '$126,859', '$129,659', '$6,322', '$5,249', '$4,308', '$77.38', '$49.56', '$24.90'],
        ['MA', 'Springfield, MA ', '$138,273', '$129,659', '$5,896', '$5,287', '$4,890', '$97.96', '$90.07', '$25.70'],
        ['MD', 'Philadelphia-Wilmington-Atlantic City, PA-NJ-DE-MD ', '$132,433', '$117,811', '$6,389', '$5,797', '$4,976', '$65.35', '$49.69', '$22.45'],
        ['MD', 'Non-Metro: MD ', '$99,539', '$90,385', '$5,902', '$4,881', '$4,284', '$80.36', '$67.38', '$21.38'],
        ['MD', 'Washington-Baltimore, DC-MD-VA-WV ', '$135,240', '$119,877', '$6,016', '$5,659', '$4,975', '$77.88', '$53.94', '$21.73'],
        ['ME', 'Boston-Worcester-Lawrence, MA-NH-ME-CT ', '$153,676', '$141,313', '$6,587', '$6,030', '$5,331', '$83.69', '$68.99', '$25.65'],
        ['ME', 'Non-Metro: ME ', '$122,512', '$111,807', '$6,547', '$6,109', '$5,754', '$86.76', '$83.00', '$22.66'],
        ['ME', 'Portland, ME ', '$132,678', '$117,103', '$7,911', '$6,169', '$5,997', '$86.75', '$44.83', '$24.02'],
        ['MI', 'Detroit-Ann Arbor-Flint, MI ', '$105,635', '$91,991', '$5,229', '$5,044', '$4,794', '$79.66', '$65.71', '$21.56'],
        ['MI', 'Grand Rapids-Muskegon-Holland, MI ', '$125,359', '$110,493', '$5,085', '$4,369', '$4,446', '$68.23', '$57.33', '$23.19'],
        ['MI', 'Kalamazoo-Battle Creek, MI ', '$106,682', '$96,488', '$4,704', '$3,797', '$3,622', '$77.50', '$52.67', '$21.22'],
        ['MI', 'Lansing-East Lansing, MI ', '$112,537', '$98,079', '$3,612', '$4,339', '$4,203', '$58.67', '$59.00', '$20.18'],
        ['MI', 'Non-Metro: MI ', '$101,105', '$93,944', '$3,999', '$3,781', '$3,650', '$71.55', '$61.57', '$20.67'],
        ['MI', 'Saginaw-Bay City-Midland, MI ', '$91,560', '$81,840', '$4,478', '$4,077', '$4,424', '$96.27', '$93.38', '$20.63'],
        ['MN', 'Fargo-Moorhead, ND-MN ', '$110,854', '$108,522', '$3,194', '$2,670', '$2,476', '$92.88', '$84.17', '$28.89'],
        ['MN', 'Grand Forks, ND-MN ', '$107,887', '$107,649', '$3,197', '$2,931', '$2,691', '$85.00', '$82.14', '$24.06'],
        ['MN', 'Minneapolis-St. Paul, MN-WI ', '$105,908', '$96,353', '$4,614', '$4,467', '$4,023', '$90.25', '$79.30', '$29.37'],
        ['MN', 'Non-Metro: MN ', '$94,659', '$53,688', '$3,446', '$3,201', '$2,992', '$100.38', '$81.80', '$19.64'],
        ['MO', 'Kansas City, MO-KS ', '$80,771', '$70,248', '$5,372', '$4,400', '$4,256', '$93.84', '$78.88', '$20.48'],
        ['MO', 'Non-Metro: MO ', '$58,301', '$53,688', '$3,446', '$3,095', '$2,959', '$84.22', '$72.31', '$19.64'],
        ['MO', 'Springfield, MO ', '$76,176', '$62,718', '$4,333', '$3,989', '$3,926', '$86.18', '$73.33', '$26.25'],
        ['MO', 'St. Louis, MO-IL ', '$80,180', '$68,872', '$4,754', '$4,493', '$3,761', '$67.45', '$54.21', '$21.04'],
        ['MS', 'Biloxi-Gulfport-Pascagoula, MS ', '$86,052', '$80,041', '$4,098', '$3,761', '$2,983', '$83.75', '$34.33', '$17.00'],
        ['MS', 'Jackson, MS ', '$71,580', '$62,776', '$3,815', '$3,635', '$3,485', '$79.25', '$80.50', '$16.83'],
        ['MS', 'Memphis, TN-AR-MS ', '$81,716', '$70,511', '$4,360', '$4,548', '$3,784', '$58.17', '$59.61', '$18.88'],
        ['MS', 'Non-Metro: MS ', '$83,089', '$76,143', '$3,467', '$2,798', '$2,713', '$84.25', '$64.94', '$17.69'],
        ['MT', 'Billings, MT ', '$92,283', '$83,851', '$4,447', '$3,610', '$3,077', '$82.80', '$65.83', '$22.62'],
        ['MT', 'Missoula, MT ', '$96,838', '$87,348', '$4,160', '$3,626', '$3,315', '$67.00', '$76.50', '$22.05'],
        ['MT', 'Non-Metro: MT ', '$80,362', '$75,774', '$4,334', '$3,729', '$3,337', '$74.30', '$65.50', '$23.07'],
        ['NC', 'Asheville, NC ', '$93,706', '$85,520', '$4,671', '$4,410', '$4,275', '$77.25', '$68.50', '$22.82'],
        ['NC', 'Charlotte-Gastonia-Rock Hill, NC-SC ', '$79,012', '$74,416', '$4,830', '$4,561', '$4,163', '$60.99', '$48.81', '$20.41'],
        ['NC', 'Greensboro--Winston-Salem--High Point, NC ', '$96,072', '$83,786', '$4,946', '$4,538', '$4,195', '$55.64', '$49.30', '$19.75'],
        ['NC', 'Non-Metro: NC ', '$83,092', '$76,077', '$4,366', '$4,115', '$4,020', '$68.68', '$64.12', '$20.25'],
        ['NC', 'Raleigh-Durham-Chapel Hill, NC ', '$105,887', '$84,910', '$5,585', '$5,223', '$5,283', '$65.84', '$47.62', '$20.48'],
        ['NC', 'Wilmington, NC ', '$85,085', '$73,387', '$5,012', '$4,528', '$3,843', '$48.08', '$40.63', '$19.83'],
        ['ND', 'Fargo-Moorhead, ND-MN ', '$110,854', '$108,522', '$3,194', '$2,670', '$2,476', '$92.88', '$84.17', '$28.89'],
        ['ND', 'Grand Forks, ND-MN ', '$107,887', '$107,649', '$3,197', '$2,931', '$2,691', '$85.00', '$82.14', '$24.06'],
        ['ND', 'Non-Metro: ND ', '$124,673', '$121,943', '$3,306', '$3,067', '$3,192', '$127.56', '$84.75', '$26.31'],
        ['NE', 'Lincoln, NE ', '$102,631', '$87,213', '$4,650', '$4,875', '$4,982', '$96.50', '$79.13', '$23.64'],
        ['NE', 'Non-Metro: NE ', '$79,096', '$73,288', '$4,154', '$3,479', '$3,177', '$105.07', '$84.89', '$25.22'],
        ['NE', 'Omaha, NE-IA ', '$91,341', '$81,621', '$4,888', '$4,389', '$3,899', '$83.08', '$64.09', '$23.81'],
        ['NH', 'Boston-Worcester-Lawrence, MA-NH-ME-CT ', '$153,676', '$141,313', '$6,587', '$6,030', '$5,331', '$83.69', '$68.99', '$25.65'],
        ['NH', 'Manchester-Nashua, NH ', '$116,132', '$105,157', '$6,391', '$6,339', '$5,839', '$69.39', '$58.57', '$24.50'],
        ['NH', 'Non-Metro: NH ', '$117,552', '$109,135', '$6,477', '$5,078', '$5,112', '$80.14', '$76.75', '$25.35'],
        ['NJ', 'New York-Northern New Jersey-Long Island, NY-NJ-CT-PA ', '$150,621', '$137,156', '$7,103', '$6,408', '$5,632', '$88.86', '$60.30', '$22.89'],
        ['NJ', 'Philadelphia-Wilmington-Atlantic City, PA-NJ-DE-MD ', '$132,433', '$117,811', '$6,389', '$5,797', '$4,976', '$65.35', '$49.69', '$22.45'],
        ['NM', 'Albuquerque, NM ', '$114,318', '$92,418', '$5,346', '$4,756', '$3,609', '$87.40', '$60.80', '$21.53'],
        ['NM', 'Santa Fe, NM ', '$92,966', '$80,968', '$4,966', '$4,658', '$4,474', '$85.75', '$72.50', '$25.36'],
        ['NV', 'Las Vegas, NV-AZ ', '$88,012', '$78,325', '$4,149', '$3,948', '$3,156', '$90.74', '$86.57', '$22.15'],
        ['NV', 'Reno, NV ', '$96,240', '$82,081', '$5,003', '$4,857', '$4,155', '$58.33', '$48.67', '$23.06'],
        ['NY', 'Albany-Schenectady-Troy, NY ', '$139,007', '$130,612', '$5,446', '$4,930', '$4,693', '$90.25', '$56.15', '$24.83'],
        ['NY', 'Buffalo-Niagara Falls, NY ', '$133,196', '$128,626', '$4,464', '$4,502', '$4,138', '$79.00', '$37.25', '$23.73'],
        ['NY', 'New York-Northern New Jersey-Long Island, NY-NJ-CT-PA ', '$150,621', '$137,156', '$7,103', '$6,408', '$5,632', '$88.86', '$60.30', '$22.89'],
        ['NY', 'Rochester, NY ', '$140,547', '$130,374', '$5,016', '$4,727', '$4,151', '$86.45', '$51.24', '$27.67'],
        ['NY', 'Syracuse, NY ', '$136,368', '$133,758', '$5,028', '$4,318', '$3,805', '$79.19', '$62.94', '$25.64'],
        ['OH', 'Canton-Massillon, OH ', '$90,443', '$81,278', '$4,316', '$3,713', '$3,147', '$72.67', '$61.88', '$19.87'],
        ['OH', 'Cincinnati-Hamilton, OH-KY-IN ', '$110,694', '$97,729', '$4,601', '$4,473', '$3,572', '$63.80', '$45.50', '$21.39'],
        ['OH', 'Cleveland-Akron, OH ', '$104,675', '$93,378', '$4,986', '$4,718', '$4,050', '$66.50', '$52.50', '$20.36'],
        ['OH', 'Columbus, OH ', '$105,000', '$84,578', '$5,492', '$5,136', '$4,402', '$59.51', '$47.24', '$22.50'],
        ['OH', 'Dayton-Springfield, OH ', '$112,329', '$94,991', '$4,178', '$4,491', '$3,901', '$63.10', '$44.18', '$21.71'],
        ['OH', 'Non-Metro: OH ', '$88,918', '$75,723', '$4,923', '$4,153', '$3,747', '$70.33', '$60.34', '$22.57'],
        ['OH', 'Toledo, OH ', '$94,677', '$86,914', '$4,693', '$4,179', '$3,755', '$89.92', '$71.25', '$20.72'],
        ['OK', 'Non-Metro: OK ', '$59,061', '$55,790', '$3,592', '$3,075', '$2,657', '$124.42', '$120.91', '$19.25'],
        ['OK', 'Oklahoma City, OK ', '$88,363', '$63,057', '$3,965', '$3,943', '$3,329', '$97.25', '$99.62', '$21.32'],
        ['OK', 'Tulsa, OK ', '$80,501', '$60,057', '$4,514', '$4,022', '$3,462', '$70.11', '$46.41', '$22.08'],
        ['OR', 'Eugene-Springfield, OR ', '$124,381', '$102,868', '$4,175', '$4,270', '$3,282', '$109.48', '$63.38', '$24.41'],
        ['OR', 'Non-Metro: OR ', '$102,726', '$98,061', '$4,437', '$3,989', '$3,455', '$90.00', '$88.00', '$22.63'],
        ['OR', 'Portland-Salem, OR-WA ', '$111,953', '$102,835', '$5,049', '$4,392', '$3,772', '$69.58', '$52.13', '$23.85'],
        ['PA', 'Allentown-Bethlehem-Easton, PA ', '$141,620', '$127,170', '$3,773', '$4,479', '$4,111', '$98.47', '$88.53', '$24.22'],
        ['PA', 'Erie, PA ', '$116,880', '$101,627', '$4,808', '$5,014', '$3,858', '$85.20', '$65.78', '$22.40'],
        ['PA', 'Harrisburg-Lebanon-Carlisle, PA ', '$123,439', '$111,281', '$4,950', '$4,825', '$4,680', '$84.56', '$74.72', '$22.41'],
        ['PA', 'Lancaster, PA ', '$129,170', '$121,545', '$6,071', '$5,048', '$4,514', '$76.87', '$65.93', '$24.68'],
        ['PA', 'New York-Northern New Jersey-Long Island, NY-NJ-CT-PA ', '$150,621', '$137,156', '$7,103', '$6,408', '$5,632', '$88.86', '$60.30', '$22.89'],
        ['PA', 'Non-Metro: PA ', '$100,667', '$92,349', '$3,155', '$3,333', '$3,489', '$92.00', '$75.92', '$20.61'],
        ['PA', 'Philadelphia-Wilmington-Atlantic City, PA-NJ-DE-MD ', '$132,433', '$117,811', '$6,389', '$5,797', '$4,976', '$65.35', '$49.69', '$22.45'],
        ['PA', 'Pittsburgh, PA ', '$118,972', '$105,273', '$4,141', '$4,475', '$4,069', '$66.24', '$53.19', '$22.91'],
        ['PA', 'Reading, PA ', '$135,503', '$126,535', '$4,016', '$5,006', '$4,605', '$60.13', '$51.38', '$23.96'],
        ['PA', 'Scranton--Wilkes-Barre--Hazleton, PA ', '$107,233', '$103,321', '$3,858', '$3,841', '$2,857', '$86.50', '$72.11', '$23.79'],
        ['RI', 'Providence-Fall River-Warwick, RI-MA ', '$126,859', '$115,606', '$6,322', '$5,249', '$4,308', '$77.38', '$49.56', '$24.90'],
        ['SC', 'Charleston-North Charleston, SC ', '$88,582', '$80,709', '$5,200', '$4,525', '$3,785', '$91.62', '$73.07', '$20.50'],
        ['SC', 'Charlotte-Gastonia-Rock Hill, NC-SC ', '$79,012', '$74,416', '$4,830', '$4,561', '$4,163', '$60.99', '$48.81', '$20.41'],
        ['SC', 'Columbia, SC ', '$85,538', '$80,063', '$4,779', '$4,368', '$3,963', '$62.00', '$53.70', '$18.39'],
        ['SC', 'Greenville-Spartanburg-Anderson, SC ', '$85,395', '$77,504', '$5,024', '$4,127', '$3,794', '$60.61', '$50.33', '$19.20'],
        ['SC', 'Non-Metro: SC ', '$82,308', '$71,544', '$4,260', '$3,863', '$3,494', '$84.32', '$71.61', '$19.89'],
        ['SD', 'Non-Metro: SD ', '$80,610', '$77,500', '$3,993', '$3,294', '$3,216', '$92.56', '$91.25', '$23.00'],
        ['SD', 'Rapid City, SD ', '$87,611', '$79,391', '$4,239', '$3,859', '$3,580', '$66.75', '$60.63', '$27.69'],
        ['SD', 'Sioux Falls, SD ', '$82,892', '$72,818', '$3,867', '$3,648', '$3,337', '$62.67', '$58.89', '$24.10'],
        ['TN', 'Chattanooga, TN-GA ', '$101,645', '$77,457', '$3,804', '$3,920', '$3,205', '$65.28', '$58.44', '$21.13'],
        ['TN', 'Johnson City-Kingsport-Bristol, TN-VA ', '$78,278', '$73,186', '$3,899', '$3,865', '$3,282', '$93.13', '$84.50', '$19.43'],
        ['TN', 'Knoxville, TN ', '$79,610', '$79,172', '$4,442', '$4,239', '$3,578', '$85.94', '$87.84', '$19.70'],
        ['TN', 'Memphis, TN-AR-MS ', '$81,716', '$70,511', '$4,360', '$4,548', '$3,784', '$58.17', '$59.61', '$18.88'],
        ['TN', 'Nashville, TN ', '$93,086', '$79,512', '$4,732', '$4,581', '$3,635', '$83.27', '$72.88', '$20.41'],
        ['TN', 'Non-Metro: TN ', '$75,256', '$70,219', '$3,512', '$3,342', '$3,209', '$87.09', '$53.44', '$19.19'],
        ['TX', 'Amarillo, TX ', '$75,190', '$63,014', '$4,134', '$4,233', '$3,747', '$82.88', '$62.88', '$21.93'],
        ['TX', 'Austin-San Marcos, TX ', '$83,191', '$64,682', '$6,226', '$4,913', '$4,455', '$76.08', '$64.18', '$20.81'],
        ['TX', 'Corpus Christi, TX ', '$83,147', '$59,980', '$3,842', '$3,641', '$3,316', '$93.92', '$69.41', '$20.58'],
        ['TX', 'Dallas-Fort Worth, TX ', '$83,260', '$60,667', '$5,184', '$4,566', '$4,052', '$95.89', '$83.31', '$21.06'],
        ['TX', 'El Paso, TX ', '$74,898', '$55,892', '$3,476', '$3,488', '$2,770', '$97.00', '$83.50', '$23.53'],
        ['TX', 'Houston-Galveston-Brazoria, TX ', '$89,312', '$64,934', '$4,900', '$4,764', '$4,226', '$97.70', '$79.76', '$21.52'],
        ['TX', 'Lubbock, TX ', '$78,796', '$67,069', '$4,262', '$3,637', '$2,916', '$108.67', '$94.13', '$20.07'],
        ['TX', 'McAllen-Edinburg-Mission, TX ', '$98,462', '$56,779', '$3,023', '$2,932', '$2,765', '$96.67', '$69.00', '$16.51'],
        ['TX', 'Non-Metro: TX ', '$62,590', '$47,727', '$3,840', '$3,442', '$3,231', '$112.58', '$101.19', '$21.54'],
        ['TX', 'Odessa-Midland, TX ', '$81,424', '$67,361', '$4,333', '$4,472', '$3,774', '$81.22', '$70.25', '$23.57'],
        ['TX', 'San Antonio, TX ', '$86,286', '$62,218', '$4,764', '$4,292', '$3,803', '$101.03', '$80.47', '$19.20'],
        ['UT', 'Non-Metro: UT ', '$83,300', '$62,163', '$4,173', '$3,401', '$2,911', '$104.45', '$93.83', '$21.30'],
        ['UT', 'Salt Lake City-Ogden, UT ', '$126,374', '$74,938', '$4,470', '$4,185', '$3,387', '$86.85', '$58.50', '$24.32'],
        ['VA', 'Johnson City-Kingsport-Bristol, TN-VA ', '$78,278', '$73,186', '$3,899', '$3,865', '$3,282', '$93.13', '$84.50', '$19.43'],
        ['VA', 'Non-Metro: VA ', '$89,013', '$80,026', '$4,715', '$4,388', '$4,371', '$81.60', '$73.07', '$20.25'],
        ['VA', 'Norfolk-Virginia Beach-Newport News, VA-NC ', '$94,418', '$87,578', '$5,662', '$4,853', '$4,032', '$66.53', '$51.96', '$20.98'],
        ['VA', 'Richmond-Petersburg, VA ', '$103,886', '$91,232', '$5,883', '$4,893', '$4,120', '$108.18', '$96.38', '$21.73'],
        ['VA', 'Roanoke, VA ', '$94,039', '$83,505', '$5,016', '$4,430', '$3,668', '$76.26', '$56.29', '$19.69'],
        ['VA', 'Washington-Baltimore, DC-MD-VA-WV ', '$135,240', '$119,877', '$6,016', '$5,659', '$4,975', '$77.88', '$53.94', '$21.73'],
        ['VT', 'Burlington, VT ', '$134,280', '$114,387', '$5,263', '$5,088', '$4,762', '$71.95', '$64.34', '$25.23'],
        ['VT', 'Non-Metro: VT ', '$119,881', '$110,920', '$4,799', '$5,243', '$4,623', '$76.11', '$56.25', '$25.23'],
        ['WA', 'Bellingham, WA ', '$96,126', '$87,600', '$4,034', '$3,747', '$3,056', '$110.00', '$85.63', '$25.50'],
        ['WA', 'Non-Metro: WA ', '$107,949', '$89,264', '$5,110', '$4,313', '$3,663', '$96.38', '$84.37', '$24.86'],
        ['WA', 'Portland-Salem, OR-WA ', '$111,953', '$102,835', '$5,049', '$4,392', '$3,772', '$69.58', '$52.13', '$23.85'],
        ['WA', 'Seattle-Tacoma-Bremerton, WA ', '$134,108', '$114,468', '$4,969', '$4,879', '$3,694', '$109.10', '$100.26', '$26.76'],
        ['WA', 'Spokane, WA ', '$123,169', '$110,194', '$5,089', '$4,077', '$3,409', '$113.48', '$109.44', '$23.39'],
        ['WI', 'Appleton-Oshkosh-Neenah, WI ', '$105,459', '$97,864', '$4,544', '$4,673', '$3,601', '$66.19', '$42.94', '$21.97'],
        ['WI', 'Chicago-Gary-Kenosha, IL-IN-WI ', '$114,409', '$94,283', '$5,653', '$5,295', '$4,615', '$88.49', '$66.45', '$22.76'],
        ['WI', 'Madison, WI MSA ', '$107,409', '$95,104', '$4,946', '$4,562', '$4,321', '$86.83', '$71.63', '$25.50'],
        ['WI', 'Milwaukee-Racine, WI ', '$127,148', '$111,351', '$4,661', '$4,461', '$4,486', '$79.84', '$57.83', '$24.57'],
        ['WI', 'Minneapolis-St. Paul, MN-WI ', '$105,908', '$96,353', '$4,614', '$4,467', '$4,023', '$90.25', '$79.30', '$29.37'],
        ['WI', 'Non-Metro: WI ', '$95,331', '$87,658', '$4,388', '$3,847', '$3,429', '$127.91', '$69.45', '$23.57'],
        ['WV', 'Charleston, WV ', '$107,712', '$102,485', '$4,458', '$4,484', '$4,150', '$80.00', '$60.78', '$20.59'],
        ['WV', 'Washington-Baltimore, DC-MD-VA-WV ', '$135,240', '$119,877', '$6,016', '$5,659', '$4,975', '$77.88', '$53.94', '$21.73'],
        ['WY', 'Casper, WY ', '$88,815', '$83,647', '$3,819', '$3,598', '$3,961', '$78.80', '$75.60', '$24.43'],
        ['WY', 'Cheyenne, WY ', '$93,998', '$89,334', '$4,809', '$4,817', '$3,977', '$88.33', '$81.67', '$23.50'],
    ];
    var selectedCityData = '';

    function getCities(state) {
        var citiesList = [];
        for (var i = 0; i < ltcData.length; i++) {
            if (state === ltcData[i][0]) {
                citiesList.push(ltcData[i]);
            }
        }
        return citiesList;
    }

    function stateChange(e) {
        $('#noDataFound').hide();
        $('#ltcData').hide();
        $('#city').empty();
        $('#ltcTable').find('tr:gt(0)').remove();
        selectedCityData = getCities($('#state').val());

        var cityOptions = '';
        if (selectedCityData.length > 1) {
            cityOptions = '<option value="" selected>Select a major metropolitan area</option>';
        }

        for (var i = 0; i < selectedCityData.length; i++) {
            cityOptions += '<option value="' + selectedCityData[i][1] + '">' + selectedCityData[i][1] + '</option>';
        }

        $('#city').html(cityOptions);

        if (selectedCityData.length === 0) {
            $('#ltcData').hide();
            $('#noDataFound').show();
        } else if (selectedCityData.length === 1) {
            // if only one city exists display tabular data
            $('#city').trigger('change');
        }
    }

    function cityChange(){
        var resultHTML = [resultLabelHTML];
        var resultData = [];
        for (var i = 0; i < selectedCityData.length; i++) {
            if (selectedCityData[i][1] === $('#city').val()) {
                resultData = [
                    ['Skilled Nursing Facilities Private Room Annual Rate', selectedCityData[i][2]],
                    ['Skilled Nursing Facilities Semi-Private Room Annual Rate:', selectedCityData[i][3]],
                    ['Assisted Living Facility Monthly Rate (2 bedroom):', selectedCityData[i][4]],
                    ['Assisted Living Facility Monthly Rate (1 bedroom):', selectedCityData[i][5]],
                    ['Assisted Living Facility Monthly Rate (Studio):', selectedCityData[i][6]],
                    ['Registered Nurse Hourly Rate:', selectedCityData[i][7]],
                    ['Licensed Practical Nurse Hourly Rate:', selectedCityData[i][8]],
                    ['Home Health Aide Hourly Rate:', selectedCityData[i][9]]
                ];
            }
        }
        for (i = 0; i < resultData.length; i++) {
            resultHTML.push( resultRow( resultData[i][0], resultData[i][1] ) );
        }
        $resultTable.html(resultHTML.join('\r\n'));
        $('#ltcData').show();
        // Tealium success event on form complete
        NYLAnalytics.trackComplete($component.find('form')[0]);
    }

    function resultRow(key, value){
        var row =
            '<tr class="nyl-long-term-care-calc__results--row">' +
                '<td class="nyl-long-term-care-calc__results--result-key">' + key + '</td>' +
                '<td class="nyl-long-term-care-calc__results--result-value">' + value + '</td>' +
            '</tr>';
        return row;
    }

    function initialize(){
        $component.find('#state').change(stateChange);
        $component.find('#city').change(cityChange);
    }

    initialize();
});
