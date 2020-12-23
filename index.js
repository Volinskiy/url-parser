let urlList = [
  'www sss',
  'https://itrack.ru/portfolio/website/',
  'https://itrack.ru/portfolio/vnedrenie-crm/',
  'https://itrack.ru/portfolio/website/filter/project_type-is-korporativnyy_sayt/apply/',
  'https://itrack.ru/portfolio/vnedrenie-crm/filter/crm_project_type-is-amocrm/apply/',
  'https://itrack.ru/portfolio/website/?PAGEN_1=2',
  'https://itrack.ru/portfolio/vnedrenie-crm/?PAGEN_1=2',
  'https://itrack.ru/portfolio/vnedrenie-crm/mobifitness/',
  'https://itrack.ru/portfolio/website/miratorg/',
];


showUrlParamsList(getUrlParamsList(urlList))

function showUrlParamsList(urlParamsList){
    let outputContainer = document.querySelector('#urlParamBlick');

    // Перебор адресов из списка адресов с параметров
    for (url in urlParamsList){
        let row = addElementOnPage(outputContainer,'div', 'row');

        if (typeof urlParamsList[url] !== 'string'){
            addElementOnPage(row, 'div', 'cell', url);

            // Перебор типов параметров страцицы
            for (paramTypeName in urlParamsList[url]) {

                // Перебор значений типа параметра
                for (paramTypeValue in urlParamsList[url][paramTypeName]){
                    let machedString = urlParamsList[url][paramTypeName][paramTypeValue];

                    addElementOnPage(row, 'div', 'cell', paramTypeValue);
                    addElementOnPage(row, 'div', 'cell', machedString);
                }
            }
        } else {
            addElementOnPage(row, 'div', 'cell', url);
            addElementOnPage(row, 'div', 'cell', urlParamsList[url]);
        }
    }

    // Функция создание node-элемента и добавление в блок
    function addElementOnPage(parentNode, tagName, attrClass, innerData){
        if (typeof(tagName) === 'string'){
            let node = document.createElement(tagName);

            if (typeof(attrClass) === 'string'){ node.className = attrClass; };

            if (typeof(innerData) === 'string'){ node.innerHTML = innerData }

            // Вставиь прооверку "является ли parentNode дом узлом"
            parentNode.appendChild(node);

            return node;

        } else {
            console.log('Не могу создать DOM узел, имя тега - не строка');
        }
    }

}

function getUrlParamsList(urlsArray){
    
    let resaultList = {},
        regExpParamTypesList = {
        'type': {
                    'index': /(?:(\/vnedrenie-crm\/)|(\/website\/))$/,
                    'filter': /.*(\/filter\/).*/,
                    'project': /(?:\/vnedrenie-crm|\/website)(\/[^\/]*\/)$/,
                    'nextPage': /\?PAGEN_1=(\d{1,3})/,
                },
        'direct': {
                    'website': /(\/website\/)/,
                    'crm': /(\/vnedrenie-crm\/)/,
                },
    'filterParam': {
                    'filterParam': /\/filter\/(.*)\/apply\//,
                },
        'project': {
                    'project-code': /(?:\/vnedrenie-crm\/|\/website\/)([^\/]*)\/$/,
                    }
        };
                
    
    for (const url of urlsArray) {
        if (isUrl(url)){
            resaultList[url] = getMachedParams(url ,regExpParamTypesList);
        }
        else {
            resaultList[url] = 'Невалидный URL'
        }
    }

    return resaultList;

    
    function isUrl(stringURL) {
        return /[https|http]:\/\/.*/.test(stringURL)
    }

    function getMachedParams(url, regExpList) {
        let result = {};

        // Перебор типов страниц
        for (const urlParamType in regExpList) {
            let matchedRegExpGroupsForType = {};

            // Перебор регулярных выражений значений для типов страниц
            for (const paramItem in regExpList[urlParamType]) {
                // Если значение не сматчено, то вернёт null
                let matchingResault = url.match(regExpList[urlParamType][paramItem]);
            
                if(matchingResault){
                    matchedRegExpGroupsForType[paramItem] = matchingResault[1] || matchingResault[2];
                    result[urlParamType] = matchedRegExpGroupsForType;
                }
            }
        }
        
        return result;
    }
}
