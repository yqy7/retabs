import {unix} from "dayjs";
import {ElMessage} from "element-plus";

export const epochFormat = (epoch: number) => {
    if (epoch) {
        return unix(epoch).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
}

export const getFavicon = (url: string) => {
    return 'chrome://favicon/size/32/' + url;
}

export const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.innerText = text;
    textarea.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    } else {
        console.log('Copy to clipboard error!');
        document.body.removeChild(textarea);
        return false;
    }
}

export const openUrl = (url: string) => {
    chrome.tabs.query({url}, function (b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({url});
    });
}

export const openHistory = () => {
    let url = chrome.extension.getURL("pages/options.html#/history");
    openUrl(url);
    window.close();
}
export const openSettings = () => {
    let url = chrome.extension.getURL("pages/options.html");
    openUrl(url);
    window.close();
}

export const openChromeHistory = () => {
    openUrl('chrome://history/')
}

export const reopenSession = (sessionId: string) => {
    chrome.sessions.restore(sessionId, (restoredSession) => {
        console.log(restoredSession);
    });
}

export const copyLink = (url: string) => {
    if (copyToClipboard(url)) {
        ElMessage({
            type: 'success',
            message: 'Copy link to clipboard',
            duration: 2000
        })
    }
}
