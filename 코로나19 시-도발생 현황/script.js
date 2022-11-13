//시도만 보려면 어떻게 해야하는지

const getXMLfromAPI = async (reqURL) => {

  const response = await fetch(reqURL);
  const responseToText = await response.text();
  const responseDom = new DOMParser().parseFromString(responseToText, "application/xml");
  return responseDom;
};

function generateCityTable(objectList, gubunName){
  let bodyText = '';
  console.log(gubunName);
  objectList
  .filter(object => object.gubun === gubunName)
  .map(object => {
    const {gubun, deathCnt, localOccCnt, stdDay, defCnt, incDec} = object;
    return ({gubun, deathCnt, localOccCnt, stdDay, defCnt, incDec})
  })
  .forEach((item) => {
    const row = document.createElement('tr');
    Object.keys(item).forEach((key) => {
    const cell = document.createElement('td');
      cell.textContent = item[key]
      row.appendChild(cell);
    });
    bodyText += new XMLSerializer().serializeToString(row);
  });

  const newPage = window.open("index2.html", "newWindow")
 window.addEventListener('message', (e) => {
   if (e.data === 'load') {
     newPage.postMessage(bodyText, '*');
   }
 })
}

function domToObjectList(doc){
  const items = doc.querySelectorAll('item'); //item 배열

  console.log(items.length);

  const itemObjects = [...items].map(item => {
    return ({
      gubun: item.querySelector('gubun').textContent, //지역
      deathCnt: item.querySelector('deathCnt').textContent, //확진자수
      localOccCnt: item.querySelector('localOccCnt').textContent, //지역발생수
      stdDay: item.querySelector('stdDay').textContent, //기준시간
      defCnt: item.querySelector('defCnt').textContent, //확진자수
      incDec: item.querySelector('incDec').textContent, // 신규확진자
    })
  })

  return itemObjects; //객체 배열
}


function generateTable(objectList){
  const tbl = document.getElementsByTagName("table");
  const tblBody = document.createElement("tbody");

  objectList.forEach((item) => {
    const row = document.createElement('tr');
    row.classList.add("rowrow");

    Object.keys(item).forEach((key) => {
      const cell = document.createElement('td');
      if (key === 'gubun') {
        cell.addEventListener('click', () => {
          onCityNameClick(item[key])
        });
      }
      cell.textContent = item[key]
      row.appendChild(cell);
    });
    tblBody.appendChild(row);
  });

  tbl[0].appendChild(tblBody); //전체 테이블
}


async function onCityNameClick(gubunName){
  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + '?serviceKey=' + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220930';

  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  console.log(gubunName);

  generateCityTable(objectList, gubunName);
}

function clearTable(){
  const row = document.querySelectorAll('.rowrow');

  [...row].forEach((item) => {
    item.remove();
  });
}

async function minusclick(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';

  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  clearTable();
  generateTable(objectList
    .map(object => {
      const {gubun, defCnt, incDec} = object;
      return ({gubun, defCnt, incDec})
    }).slice(0, 8));

}

async function plusclick(){

  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';

  const doc = await getXMLfromAPI(reqURL);
  const objectList = domToObjectList(doc);

  clearTable();

  generateTable(objectList
    .map(object => {
      const {gubun, defCnt, incDec} = object;
      return ({gubun, defCnt, incDec})
    }).slice(16, 19));

}




(async function init() { //즉시실행함수
  const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
  const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';
  let reqURL = url + "?serviceKey=" + authKey + '&pageNo=1&numOfRows=10&startCreateDt=20220901&endCreateDt=20220901';

  const doc = await getXMLfromAPI(reqURL);

  console.log("doc: " + typeof doc);
  console.log(typeof doc.querySelectorAll('item')) //object
  console.log(doc.querySelectorAll('item').length) //19
  const objectList = domToObjectList(doc);

  console.log("objectList: " + objectList.length);
  generateTable(objectList
    .map(object => {
      const {gubun, defCnt, incDec} = object;
      return ({gubun, defCnt, incDec})
    }).slice(8, 16));
})();
