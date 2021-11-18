const pageProperties = {
    pageURL: window.location.href,
    debugger: 0,
    HotkeyLogging: 0,
    CoordinationLogging: 0,
    pageType: detectPage(window.location.href),
    recourceStealAmount: {
      //ATK1: Number((RACE_ID) ? 0.66 : 0.5),
      //ATK2: Number((RACE_ID) ? 0.36 : 0.5),
    },
    auctionAlert: 1,
  
  
  }
  
  
  function detectPage(URL) {
    if (URL.indexOf('galaxy') > -1)
      return 'galaxy'
    if (URL.indexOf('resource') > -1)
      return 'resource'
    if (URL.indexOf('industry') > -1)
      return 'industry'
    if (URL.indexOf('military') > -1)
      return 'military'
    if (URL.indexOf('options') > -1)
      return 'options'
  }
  
  //a Loop for everything that needs to be checked 
  setInterval(() => {
    if (pageProperties.auctionAlert && currentTime.getMinutes() > 50) {
      showDialogMessageNotification("[ There is only " + (60 - currentTime.getMinutes()) + " Minutes Left Untill Auction ]")
  
    }
  }, 30000);
  
  if (pageProperties.pageType == 'galaxy') {
    var galaxytab = document.querySelector("#galaxyBreadcrumb").innerHTML;
    var timeserver = document.querySelector("#serverTimeDisplay");
    var galaxy = {
      lastFleetUnitCount: 1,
      HarvestCoordination: undefined,
    }
    var debugMsgs = {
      AsteroidHuntReport: ' Units have been sent to Hunt the Asteroid at:[',
      AsteroidHuntReportEnd: '] Coordination',
    }
  }
  
  
  function doWithDelay(doAction, delayMs) {
    setTimeout(doAction, delayMs);
  }
  
  
  function separate(Number) {
    Number += '';
    Number = Number.replace(',', '');
    x = Number.split('.');
    y = x[0];
    z = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(y))
      y = y.replace(rgx, '$1' + ',' + '$2');
    return y + z;
  }
  
  
  function sendHarvesterToAstroid(units, pc1, pc2, pc3) {
    galaxy.lastFleetUnitCount = units;
    var requestData = {
      type: 'SendFleet',
      mission: 8,
      speed: 10,
      metal: 0,
      crystal: 0,
      gas: 0,
      scrap: 0,
      c1: pc1,
      c2: pc2,
      c3: pc3,
      battle_rounds: 12,
      speed_motivation: 0,
      scrap_motivation: 0,
      flight_hours: 0,
      flight_minutes: 0
    };
    requestData['ship[' + RACE_ID + '][11]'] = units;
  
    $.post("ajax_fleets.php", requestData, function(response) {
      var info = eval('(' + response + ')');
  
      if (info.pass == '0') {
        showDialogMessagePopup(info.info);
        return false;
      } else {
        showDialogMessage(Success);
        return true;
      }
    });
  }
  
  
  function squareInfo(c1, c2, c3) {
    if (MouseOverFix == 1) {
      return;
    }
    MouseOverFix = 1;
  
    UnTip();
    galaxy.HarvestCoordination = c3;
    //Debugging section
    if (pageProperties.CoordinationLogging == 1)
      console.log(galaxy.HarvestCoordination);
  
    if (isset(squaresInfo[c1]) && isset(squaresInfo[c1][c2]) && isset(squaresInfo[c1][c2][c3])) {
      Tip(squaresInfo[c1][c2][c3]);
    } else {
      Tip('<img src="' + GLOBAL_HTTP_PATH_IMAGES + 'img/tooltip_loading.gif" border="0px" alt="Loading" style="padding: 10px;"/>');
      $.post("ajax_info.php", {
        type: 'squareInfo',
        c1: c1,
        c2: c2,
        c3: c3
      }, function(response) {
        if (response != "") {
          squaresInfo[c1] = squaresInfo[c1] || {};
          squaresInfo[c1][c2] = squaresInfo[c1][c2] || {};
          squaresInfo[c1][c2][c3] = response;
          Tip(squaresInfo[c1][c2][c3]);
        }
      });
    }
    MouseOverFix = 0;
    return true;
  }
  
  
  document.addEventListener('keypress', (event) => {
    if (pageProperties.pageType == 'galaxy') {
      if ((event.code == 'KeyS') && (galaxy.HarvestCoordination != undefined)) {
        sendHarvesterToAstroid(1, c1.value, c2.value, galaxy.HarvestCoordination);
        //Debugging section
        if (pageProperties.debugger == 1)
          console.log(galaxy.lastFleetUnitCount + debugMsgs.AsteroidHuntReport + c1.value + ',' + c2.value + ',' + galaxy.HarvestCoordination + debugMsgs.AsteroidHuntReportEnd)
      }
      if ((event.code == 'KeyA')) moveDown('c2');
      if ((event.code == 'KeyD')) moveUp('c2');
      if ((event.code == 'KeyT')) drawTimerInGalaxyTab();
      if ((event.code == 'KeyW')) galaxy.HarvestCoordination++, sendHarvesterToAstroid(1, c1.value, c2.value, galaxy.HarvestCoordination);
    }
    if (pageProperties.pageType == 'resource') {
      if ((event.code == 'Numpad7')) upgrade_level(1);
      if ((event.code == 'Numpad8')) upgrade_level(2);
      if ((event.code == 'Numpad9')) upgrade_level(3);
      if ((event.code == 'Numpad4')) upgrade_level(4);
      if ((event.code == 'Numpad5')) upgrade_level(5);
      if ((event.code == 'Numpad6')) upgrade_level(6);
      if ((event.code == 'Numpad1')) upgrade_level(7);
      if ((event.code == 'Numpad2')) upgrade_level(8);
      if ((event.code == 'Numpad3')) upgrade_level(9);
      if ((event.code == 'Numpad0')) upgrade_level(10);
    }
    if (pageProperties.pageType == 'options' && document.querySelector("#TabAdministrative").attributes.style.value.indexOf('none') <= !0) {
      if ((event.code == 'KeyT')) resourceStealingTip([0, 1, 2, 3, 4]), activateSpyReportPotential([0, 1, 2, 3, 4]);
    }
    //Debugging section
    if (pageProperties.HotkeyLogging == 1)
      console.log(event.code + "," + event.key);
  }, false);
  
  function drawTimerInGalaxyTab() {
    document.querySelector("#galaxyBreadcrumb").innerHTML = galaxytab + timeserver.outerHTML;
    timeserver.outerHTML = ""
  }
  
  function readResourceTable(tableNumber) {
    let table = document.getElementsByClassName('messageBody')[tableNumber].childNodes[4].childNodes[1];
    let metal = Number(table.childNodes[0].childNodes[1].innerHTML);
    let crystal = Number(table.childNodes[2].childNodes[1].innerHTML);
    let gas = Number(table.childNodes[4].childNodes[1].innerHTML);
    let scrap = Number(table.childNodes[6].childNodes[1].innerHTML);
    let SumTotal = Number(metal + crystal + gas + scrap);
    let ATK1 = SumTotal * Number(pageProperties.recourceStealAmount.ATK1);
    let ATK2 = ATK1 * Number(pageProperties.recourceStealAmount.ATK2);
    return [ATK1, ATK2]
  }
  
  
  function resourceStealingTip(x) {
    x.forEach(data => {
      if (document.getElementsByClassName('messageBody')[data].childElementCount > 6) {
        let info = Math.round(readResourceTable(data)[0]);
        let table = document.getElementsByClassName('messageBody')[data].childNodes[4]
        table.setAttribute('onmouseover', "Tip(" + "'Potential: " + separate(info) + "')")
        table.setAttribute('onmouseout', "UnTip();")
      }
    });
  }
  
  function activateSpyReportPotential(x) {
    x.forEach(data => {
      if (document.getElementsByClassName('messageBody')[data].childElementCount > 6) {
        let info = readResourceTable(data)
        let table = document.getElementsByClassName('messageBody')[data].childNodes[4].childNodes[1]
        table.appendChild(document.createElement('tr'))
        table.lastChild.appendChild(document.createElement('td'))
        table.lastChild.childNodes[0].innerHTML = "ATK-1";
        table.lastChild.appendChild(document.createElement('td'))
        table.lastChild.childNodes[1].innerHTML = separate(Math.round(info[0]));
  
        table.appendChild(document.createElement('tr'))
        table.lastChild.appendChild(document.createElement('td'))
        table.lastChild.childNodes[0].innerHTML = "ATK-2";
        table.lastChild.appendChild(document.createElement('td'))
        table.lastChild.childNodes[1].innerHTML = separate(Math.round(info[1]));
      }
    });
  }
console.log('script ran properly')
