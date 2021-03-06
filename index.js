
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

let buttonRunUrlPars = document.querySelector('#buttonRunUrlPars'),
    buttonLoadTextData = document.querySelector('#buttonLoadTextData'),
    urlEditField = document.querySelector('#urlEditField');

// Вывод результата парсинга url адресов
buttonRunUrlPars.addEventListener('click', function(){
    let urlListFromTextArea = urlEditField.value.replace(/\r\n/g,"\n").split("\n");
    
    showUrlParamsList(getUrlParamsList(urlListFromTextArea))
})

// Загрузка тестовых данных в текстовое поле
buttonLoadTextData.addEventListener('click', function(){
    let joinUrlStrings = '';
    
    urlList.forEach(function(urlElemnt, index, array){
        joinUrlStrings += urlElemnt;
        joinUrlStrings += (index < (array.length - 1)) ? '\n': '';
    })
    
    urlEditField.value = joinUrlStrings;
})

// Вывод результата парсинга переданного массива url адресов
function showUrlParamsList(urlParamsList){
    let outputContainer = document.querySelector('#urlParamBlock');

    // Очищаем содержимое блока вывода
    outputContainer.innerHTML = '';

    // Перебор адресов переданного списка адресов
    for (url in urlParamsList){
        let row = addElementOnPage(outputContainer,'div', 'url-parametrs-block');

        if (typeof urlParamsList[url] !== 'string'){
            addElementOnPage(row, 'div', 'url-parametrs-block__url', url);

            let blockParametrs = addElementOnPage(row, 'div', 'url-parametrs-block__parametr');
            addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell url-parametrs-block__cell--header', 'Параметры страницы');
            addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell url-parametrs-block__cell--header', 'Сматченые значения');

            // Перебор типов параметров страцицы
            for (paramTypeName in urlParamsList[url]) {
                let blockParametrs = addElementOnPage(row, 'div', 'url-parametrs-block__parametr');

                // Перебор значений типа параметра
                for (paramTypeValue in urlParamsList[url][paramTypeName]){
                    let machedString = urlParamsList[url][paramTypeName][paramTypeValue],
                        parametrDescription = paramTypeName + ': ' + paramTypeValue;

                    addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell', parametrDescription);
                    addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell', machedString);
                }
            }
        } else {  // Вывод блока для невалидного url
            addElementOnPage(row, 'div', 'url-parametrs-block__url', url);
            
            let blockParametrs = addElementOnPage(row, 'div', 'url-parametrs-block__parametr');
            
            addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell', urlParamsList[url]);
            addElementOnPage(blockParametrs, 'div', 'url-parametrs-block__cell', urlParamsList[url]);
        }
    }

    // Функция создания node-элемента и добавления его в блок
    function addElementOnPage(parentNode, tagName, attrClass, innerData){
        if (typeof(tagName) === 'string'){
            let node = document.createElement(tagName);

            if (typeof(attrClass) === 'string'){ node.className = attrClass; };

            if (typeof(innerData) === 'string'){ node.innerHTML = innerData }

            // Вставиь проверку "является ли parentNode дом узлом"
            parentNode.appendChild(node);

            return node;

        } else {
            console.log('Не могу создать DOM узел, имя тега - не строка');
        }
    }

}

// Парсинг переданного массива url адресов
function getUrlParamsList(urlsArray){
    
    let resultList = {},
        // Параметры страниц и соответствующие им регулярные выражения
        regExpParamTypesList = {
        'type': {
                    'index': /(?:(.*\/vnedrenie-crm\/)|(.*\/website\/))$/,
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
            resultList[url] = getMachedParams(url ,regExpParamTypesList);
        }
        else {
            resultList[url] = 'Невалидный URL'
        }
    }

    return resultList;

    
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
                let matchingResult = url.match(regExpList[urlParamType][paramItem]);
            
                if(matchingResult){
                    matchedRegExpGroupsForType[paramItem] = matchingResult[1] || matchingResult[2];
                    result[urlParamType] = matchedRegExpGroupsForType;
                }
            }
        }
        
        return result;
    }
}