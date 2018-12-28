const width = wx.getSystemInfoSync().windowWidth;
const height = wx.getSystemInfoSync().windowHeight;

export default class Button {
    constructor(context, text = '开始游戏', w = 168, h = 48) {

        const blur = 8;
        context.fillStyle = '#666666';
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 2;
        context.shadowColor = '#999999';
        context.shadowBlur = blur;

        const rectW = w;
        const rectH = h;
        context.fillRect((width - rectW) / 2, (height - rectH) / 2, rectW, rectH);

        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowColor = '#ffffff';
        context.shadowBlur = 0;
        context.fillStyle = '#ffffff';
        context.font = '16px sans-serif';
        context.textAlign = 'center';
        const tX = width / 2;
        const tY = height / 2 + 8;
        context.fillText(text, tX, tY, 100);
    }
}
