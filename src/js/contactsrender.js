/**
 * Fügt einen Buchstabenbereich (A, B, C) und einen Separator in die Kontaktliste ein.
 * @param {HTMLElement} contactList - Das Element, in welches Separator und Buchstabe eingefügt werden.
 * @param {string} letter - Der anzuzeigende Buchstabe.
 */

function renderLetterArea(contactList, letter) {
    contactList.innerHTML += `
      <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
      <div class="contactlist-seperator"></div>
    `;
  }
  
  /**
   * Fügt einen einzelnen Kontakt in die Kontaktliste ein.
   * @param {HTMLElement} contactList - Das Element, in welches der Kontakt eingefügt werden soll.
   * @param {string} id - Die ID des Kontaktobjekts.
   * @param {Object} contact - Das Kontaktobjekt.
   * @param {string} imageSrc - Die Bildquelle des Kontakts.
   */
  function renderContactItem(contactList, id, contact, imageSrc) {
    contactList.innerHTML += `
      <div id="contactlist-item-${id}" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="selectContact('${id}')">
        <img class="d-flex pointer" src="${imageSrc}"/>
        <div class="contactlist-databox flex-d-col">
          <div class="pointer no-wrap-text fw-400 fs-20">${contact.name}</div>
          <a class="pointer color-lb fs-16 text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
        </div>
      </div>
    `;
  }
  
  /**
   * Rendert den Kopfbereich eines Kontakts in der Detailansicht.
   * @param {HTMLElement} contactSection - Das Element, in welches der Kontaktkopf eingefügt werden soll.
   * @param {Object} contact - Das Kontaktobjekt.
   * @param {string} contactId - Die ID des Kontaktobjekts.
   */
  function renderContactHead(contactSection, contact, contactId) {
    contactSection.innerHTML += `
      <div class="animation-100">
        <div class="contact-information item-center d-flex">
          <img src="${contact.img || generateProfileImage(contact.name)}" class="d-flex gap-10 obj-cover bradius70"/>
          <div class="d-flex flex-d-col gap-8 item-start flex-grow">
            <p class="mg-block-inline fw-500 no-wrap-text fs-47">${contact.name}</p>
            <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
              <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm('${contactId}')" id="edit-btn">
                <img class="obj-cover img-24" src="./img/edit.png">Edit
              </button>
              <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteContact('${contactId}')" id="del-btn">
                <img class="obj-cover img-24" src="./img/delete.png">Delete
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
  
  /**
   * Rendert die detaillierten Informationen eines Kontakts.
   * @param {HTMLElement} contactSection - Das Element, in welches die Kontaktinformationen eingefügt werden sollen.
   * @param {Object} contact - Das Kontaktobjekt.
   */
  function renderContactInfo(contactSection, contact) {
    contactSection.innerHTML += `
      <div class="animation-100">
        <div id="contact-information-content" class="d-flex flex-d-col no-wrap-text">
          <p class="fw-400 l-height-24 fs-20 mg-block-inline">Contact Information</p>
          <div class="contact-information-data d-flex flex-d-col gap-22">
            <div class="d-flex flex-d-col gap-15 text-left">
              <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Email</b></p>
              <a class="pointer color-lb text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
            </div>
            <div class="d-flex flex-d-col gap-15 text-left">
              <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Phone</b></p>
              <p class="fs-16 fw-400 no-wrap-text mg-block-inline l-height-19 txt-left">${contact.phone}</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  
/**
 * Generiert ein Profilbild mit Initialen basierend auf dem Namen des Kontakts.
 * @param {string} name - Der Name des Kontakts.
 * @returns {string} - Ein Base64-encoded SVG-Bild.
 */
function generateProfileImage(name) {
  let colors = ["#FF5733","#33FF57","#3357FF","#FF33A1","#F3FF33","#33FFF3"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  let initials = name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
  const svgImage = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="${randomColor}" />
    <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svgImage)}`;
}