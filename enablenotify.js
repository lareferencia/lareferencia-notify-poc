function getHashFromUrl(url) {
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) {
        // if the URL doesn't contain a hash, return null
        return null;
    }
    return url.slice(hashIndex + 1);
}


// normilize the string removing special characters and multiple spaces
function normalizeString(str) {
    return str.trim().toUpperCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

// normalize the url removing the hash and the trailing slash
function normalizeUrl(url) {
    // remove hash
    url = url.split('#')[0];
    // remove trailing slash
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    return url;
}

// change the dom to add the unique url and the certification status to each row
function notifyEnabler(dom, url) {
    const table = dom.querySelector('table');

    const headerRow = table.rows[0];
    const uniqueUrlHeader = headerRow.insertCell(3);
    uniqueUrlHeader.innerHTML = '<b>Unique URL</b>';
    const certificationStatusHeader = headerRow.insertCell(4);
    certificationStatusHeader.innerHTML = '<b>Certification Status</b>';

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const title = normalizeString(row.querySelector('td:nth-child(1)').textContent);
        const year = normalizeString(row.querySelector('td:nth-child(2)').textContent);
        const authors = normalizeString(row.querySelector('td:nth-child(3)').textContent);

        const hash = md5(title + authors + year);
        const uniqueUrl = `${url}#${hash}`;

        const cell = document.createElement('td');
        const anchor = document.createElement('a');
        anchor.href = `#${hash}`;
        anchor.textContent = uniqueUrl;
        cell.appendChild(anchor);
        row.appendChild(cell);

        const certifiedCell = document.createElement('td');
        row.appendChild(certifiedCell);

        const isCertified = is_certified(uniqueUrl);
        if (isCertified) {
            certifiedCell.textContent = 'CERTIFIED';
        } else {
            const askButton = document.createElement('button');
            askButton.textContent = 'Ask for certification';
            certifiedCell.appendChild(askButton);

            askButton.addEventListener('click', () => {
                askForCertification(uniqueUrl);
            });
        }
    });
}