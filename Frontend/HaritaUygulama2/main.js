// Harita oluştur
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([35.3191, 39.0099]),
    zoom: 7,
  }),
});

// Çizim katmanını oluştur
const vectorSource = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});
map.addLayer(vectorLayer);

// Çizim aracını oluştur
let draw;

const notification = document.getElementById("notification");
// Bildirimi göster
// Bildirim fonksiyonunu Toastify ile güncelle
function showNotification(message) {
  Toastify({
    text: message,
    duration: 2500, // Bildirimin görüntülenme süresi (ms cinsinden)
    gravity: "top", // Bildirimin konumu (top, bottom, center, vb.)
    position: "right", // Bildirimin yeri (right, left, center, vb.)
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Bildirim arkaplan rengi
  }).showToast();
}


// Çizim aracını başlat
draw = new ol.interaction.Draw({
  source: vectorSource,
  type: "Point", // İşaretleme türü (Point, LineString, Polygon, vb.)
});

// Çizim tamamlandığında işlem yapmak için "drawend" olayını dinle
draw.on("drawend", (event) => {
  // Çizim tamamlandığında burada yapılacak işlemleri ekleyin

  // Örneğin, çizim aracını kapatmak için:
  map.removeInteraction(draw);
});

// Add Point butonuna tıklanınca
addButton.addEventListener("click", () => {
  // Eğer daha önce çizim aracı başlatıldıysa kapat
  if (draw) {
    map.removeInteraction(draw);
  }

  // Çizim aracını başlat
  map.addInteraction(draw);
  console.log(vectorSource);

  // Tıklama olayını dinle
  map.once("click", (event) => {
    // Tıklanan noktanın koordinatlarını al
    const coordinates = event.coordinate;

    jsPanel.colorFilled = 0.25;
    // jsPanel oluştur
    const panel = jsPanel.create({
      theme: "dark",
      headerTitle: "Point Bilgileri",
      content: `
              <div class="add-panel">
              <div>
                  <label for="pointName">Point Adı:</label>
                  <input type="text" id="pointName">
              </div>
              <div>
                  <label for="xCoord">X Koordinatı:</label>
                  <input type="text" id="xCoord" value="${coordinates[0]}" readonly>
              </div>
              <div>
                  <label for="yCoord">Y Koordinatı:</label>
                  <input type="text" id="yCoord" value="${coordinates[1]}" readonly>
              </div>
              <button id="saveButton">Kaydet</button>
              <div>
              `,
      callback() {
        // Kaydet butonuna tıklanınca
        const saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
          // Point adını al
          const pointName = document.getElementById("pointName").value;

          // İşaretlemeyi yap
          const pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            name: pointName, // İşaretleme için adı ekleyin
          });
          vectorSource.addFeature(pointFeature);

          const url = "http://localhost:5290/api/Door/Add";

          const data = {
            name: pointName,
            x: coordinates[0],
            y: coordinates[1],
          };

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };

          fetch(url, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error("HTTP Hatası " + response.status);
              }
              return response.json();
            })
            .then((data) => {
              showNotification("Başarılı");

              // Çizim aracını kapat
              map.removeInteraction(draw);

              // Paneli kapat
              panel.close();
            })
            .catch((error) => {
              console.error("Hata:", error);
              showNotification("Başarısız");

              // Çizim aracını kapat
              map.removeInteraction(draw);
            });
        });
      },
    });
    panel.classList.add('addpoint');
  });
});


// "queryButton" düğmesini seç
document.addEventListener('DOMContentLoaded', function () {
  let table = new DataTable('#example');
});

const queryButton = document.getElementById("queryButton");

// "queryButton" düğmesine tıklanınca
queryButton.addEventListener("click", () => {
  // jsPanel oluştur
  const panel = jsPanel.create({
    theme: "dark",
    headerTitle: "Veri Tablosu",
    position: "center", // Paneli ekranın ortasına yerleştir
    content: `
      <table id="myTable" class="display" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>X</th>
            <th>Y</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <!-- Veriler burada görüntülenecek -->
        </tbody>
      </table>
    `,
    contentSize: {
      width: "80%", // Panelin genişliği
      height: "80%", // Panelin yüksekliği
    },
    callback: () => {
      // DataTable initialization code
      const tableElement = document.getElementById("myTable");
      if (tableElement && tableElement.DataTable) {
        tableElement.DataTable.destroy();
      }

      const dataTable = new DataTable(tableElement, {
        ajax: {
          url: "http://localhost:5290/api/Door/GetAll",
          dataSrc: "",
        },
        columns: [
          { data: "id" },
          { data: "name" },
          { data: "x" },
          { data: "y" },
          {
            // Update düğmesi sütunu
            data: null,
            render: function (data, type, row) {
              return `<button class="update-button background-svg" data-id="${row.id}" data-name="${row.name}" data-x="${row.x}" data-y="${row.y}"></button>`;
            },
          },
          {
            // Delete düğmesi sütunu
            data: null,
            render: function (data, type, row) {
              return `<button class="delete-button background-svg-delete" data-id="${row.id}"></button>`;
            },
          },
        ],
      });

      // Delete düğmesine tıklama işlemi
      tableElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-button")) {
          const id = e.target.getAttribute("data-id");
          const deletePanel = jsPanel.create({
            // Panel ayarları
            theme: "dark",
            headerTitle: "Veri Silme",
            position: "center",
            content: `
            <div class ="delete-panel">
              <div>
                Silmek İstediğinizden emin misiniz?
              </div>
              <div>
                <button id="deleteYesButton">Evet</button>
                <button id="deleteNoButton">Hayır</button>
              </div>
              <div>
            `,
            contentSize: {
              width: "80%",
              height: "80%",
            },
          });

          // Evet düğmesine tıklama işlemi
          const deleteYesButton = document.getElementById("deleteYesButton");
          const deleteNoButton = document.getElementById("deleteNoButton");

          deleteYesButton.addEventListener("click", () => {
            // Silme işlemi 
            
            // Önce backend'e DELETE request
            fetch(`http://localhost:5290/api/Door/Delete/${id}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Silme işlemi başarısız oldu.");
                }
                return response.json();
              })
              .then((data) => {
                showNotification("Başarılı bir şekilde silindi");
                deletePanel.close(); // Paneli kapat
              })
              .catch((error) => {
                showNotification("Silinemedi");
              });
          });

          deleteNoButton.addEventListener("click", () => {
            // Silme işlemi iptal edildi
            deletePanel.close(); 
          });
        }
      });

      // Update düğmesine tıklama işlemi
      tableElement.addEventListener("click", (e) => {
        if (e.target.classList.contains("update-button")) {
          const id = e.target.getAttribute("data-id");
          const name = e.target.getAttribute("data-name");
          const x = e.target.getAttribute("data-x");
          const y = e.target.getAttribute("data-y");
          const updatePanel = jsPanel.create({
            // Panel ayarları
            theme: "dark",
            headerTitle: "Veri Güncelleme",
            position: "center",
            content: `
              <div class="update-panel"> 
                <div>
                  <label>Yeni Adı Girin:</label>
                  <input type="text" id="newName" value="${name}">
                </div>
                <div>
                  <button id="updateNameButton">Adı Değiştir</button>
                </div>
                <div>
                  <label>Yeni X Koordinatını Girin:</label>
                  <input type="text" id="newX" value="${x}" readonly>
                </div>
                <div>
                  <label>Yeni Y Koordinatını Girin:</label>
                  <input type="text" id="newY" value="${y}" readonly>
                </div>
                <div>
                  <button id="updateCoordinatesButton">Koordinatları Değiştir</button>
                </div>
              </div>
            `,
            contentSize: {
              width: "80%",
              height: "80%",
            },
          });

          // Adı Değiştir düğmesine tıklama işlemi
          const updateNameButton = document.getElementById("updateNameButton");
          
          updateNameButton.addEventListener("click", () => {
            const newName = document.getElementById("newName").value;
            panel.close();
            updatePanel.close();
            // Güncelleme işlemi burada yapılabilir

            // Yeni adı ve ilgili ID'yi kullanarak backend'e PUT isteği gönderin
            fetch(`http://localhost:5290/api/Door/UpdateData/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                NewName: newName,
                NewX: 0, // X koordinatını 0 olarak ayarla
                NewY: 0, // Y koordinatını 0 olarak ayarla
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Güncelleme işlemi başarısız oldu.");
                }
                return response.json();
              })
              .then((data) => {
                // Başarılı bir şekilde güncellendiğini varsayalım, gerekirse kontrol ekleyin
                showNotification("Güncelleme başarılı");
                updatePanel.close(); // Paneli kapat
              })
              .catch((error) => {
                showNotification("Güncelleme başarısız!!");
                // Hata mesajını kullanıcıya gösterme veya işlemi geri almayı düşünün
              });
          });
        

          // Koordinatları Değiştir düğmesine tıklama işlemi
          
          const updateCoordinatesButton = document.getElementById("updateCoordinatesButton");
          updateCoordinatesButton.addEventListener("click", () => {
            if (draw) {
              map.removeInteraction(draw);
            }
          
            // Çizim aracını başlat

            map.addInteraction(draw);
            console.log(vectorSource);
            panel.close();
            updatePanel.close();
          
            map.once("click", (event) => {
              // Tıklanan noktanın koordinatlarını al
              const kordinat = event.coordinate;
          
              jsPanel.colorFilled = 0.25;
              const panel = jsPanel.create({
                theme: "dark",
                headerTitle: "Yeni Point Bilgileri",
                content: `
                        <div class="add-panel">
                        <div>
                            <label for="newX">X Koordinatı:</label>
                            <input type="text" id="newX" value="${kordinat[0]}" readonly>
                        </div>
                        <div>
                            <label for="newY">Y Koordinatı:</label>
                            <input type="text" id="newY" value="${kordinat[1]}" readonly>
                        </div>
                        <button id="saveButton">Kaydet</button>
                        <div>
                        `,
                callback() {
                  // Kaydet butonu
                  const saveButton = document.getElementById("saveButton");
                  saveButton.addEventListener("click", () => {
                   // İşaretleme
                   
                    const pointFeature = new ol.Feature({
                      geometry: new ol.geom.Point(kordinat),
                      
                    });
                    const newName = "string";
                    const newX = kordinat[0];
                    const newY = kordinat[1];
                    vectorSource.addFeature(pointFeature);
          
                    const url = `http://localhost:5290/api/Door/UpdateData/${id}`;
          
                    
                    const requestOptions = {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        NewName: "string", // Yeni adı string olarak ayarla
                        NewX: newX, // X koordinatını float olarak ayarla
                        NewY: newY,
                      }),

                    };
                    
                    
          
                    fetch(url, requestOptions)
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error("HTTP Hatası " + response.status);
                        }
                        return response.json();
                      })
                      .then((data) => {
                        showNotification("Güncelleme Başarılı");
                        updatePanel.close();
                        // Çizim aracını kapat
                        map.removeInteraction(draw);
          
                        // Paneli kapat
                        panel.close();
                      })
                      .catch((error) => {
                        console.error("Hata:", error);
                        showNotification("Güncelleme Başarısız");
          
                        // Çizim aracını kapat
                        map.removeInteraction(draw);
                      });
                  });
                },
              });
              panel.classList.add('update-panel');
            });
          });

        }
      });
    },
  });
});


let markersData = [];
let intervalId; // setInterval işleminin kimlik numarasını saklayan değişken

function updateMarkersOnMap() {
  vectorSource.clear();

  markersData.forEach((point) => {
    const coordinates = [point.x, point.y];
    const markerFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinates),
      name: point.name,
    });

    const text = new ol.style.Text({
      text: point.name,
      offsetY: -15,
      fill: new ol.style.Fill({ color: 'black' }),
    });

    const style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({ color: 'red' }),
      }),
      text: text,
    });

    markerFeature.setStyle(style);

    vectorSource.addFeature(markerFeature);
  });

  // Haritayı yeniden çiz
  map.updateSize();
}

function fetchAndShowMarkers() {
  const url = "http://localhost:5290/api/Door/GetAll";
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP Hatası " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      markersData = data;
      updateMarkersOnMap();
      if (intervalId) {
        clearInterval(intervalId); // setInterval'i durdur
      }
      intervalId = setInterval(fetchAndShowMarkers, 5000); // Yeniden başlat
    })
    .catch((error) => {
      console.error("Hata:", error);
    });
}


fetchAndShowMarkers();






