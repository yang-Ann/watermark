export type WaterMarkOptions = Partial<{
	id: string;
	fontSize: number;
	color: string;
	rotate: number;
	context: string;
	width: number;
	height: number;
	container: string | HTMLElement;
}>;

export type RWaterMarkOptions = Required<WaterMarkOptions>;

const defaultOptions: RWaterMarkOptions = {
	id: "globalWaterMark",
	fontSize: 12,
	color: "rgba(128,128,128,.6)",
	rotate: -30,
	context: "默认水印",
	width: 200,
	height: 100,
	container: document.body,
};

/**
 * 创建水印
 */
export default class WaterMark {

	// 水印配置
  public options: RWaterMarkOptions;
	public el: HTMLDivElement;
	public waterMarkOb: MutationObserver | null;

	constructor(opt: WaterMarkOptions) {
		this.options = Object.assign(defaultOptions, opt);

		this.init();
	}

	public get container() {
		const container = this.options.container;
		let ret: Element = document.body;
		if (typeof container === "string") {
			const res = document.querySelector(container);
			if (res) ret = res;
		} else if (container instanceof HTMLElement) {
			ret = container;
		}
		return ret;
	}

  public init(): void {
    this.setWaterMark();
  }

	/**
	 * 创建水印 img
	 */
	public createWaterMark(): string {
    const { fontSize, color, context, width, height, rotate } = this.options;
    let ret = "";
		const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = width;
      canvas.height = height;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.translate(width / 4, height / 4);
      ctx.rotate((rotate / 180) * Math.PI);
      ctx.fillText(context, 0, canvas.height / 2);
      // 将canvas 转为 dataURL
      const base64Url = canvas.toDataURL("image/png");
      ret = base64Url;
    }
    return ret;
  }

  /**
   * 设置水印
   */
  public setWaterMark() {
		const { id } = this.options;
		const url = this.createWaterMark();
		const target = document.getElementById(id);
		if (target) this.container.removeChild(target);
		this.el = document.createElement("div");
    this.el.setAttribute("id", id);
		const styleStr = `width: ${this.container.scrollWidth}px;
											height: ${this.container.scrollHeight}px;
											z-index: 9999;
											background-repeat: repeat;
											overflow: hidden;
											pointer-events: none;
											background-image: url('${url}')`;
    this.el.style.cssText = styleStr;
		this.container.appendChild(this.el);
		// 监听DOM变动
    // @ts-ignore
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if (!MutationObserver) return;
		this.waterMarkOb = new MutationObserver(() => {
			const _globalWatermark = document.querySelector(`#${id}`);
			// 当样式或者水印元素dom节点有改动时会重新绘制
			if (
				(_globalWatermark &&
					_globalWatermark.getAttribute("style") !== styleStr) ||
				!_globalWatermark
			) {
				this.disconnect();
				this.setWaterMark();
			}
		});
		// 指定观察对象
		if (this.waterMarkOb) {
			this.waterMarkOb.observe(document.body, {
				attributes: true,
				subtree: true,
				childList: true,
			});
		}
	}

	// MutationObserver 停止观察
	public disconnect() {
		if (this.waterMarkOb) this.waterMarkOb.disconnect();
		this.waterMarkOb = null;
	}

	/**
   * 设置水印文本
   * @param text 水印文本
   */
  public setText(text: string): void {
    this.options.context = text;
		this.disconnect();
		this.setWaterMark();
  }

	/**
	 * 重新渲染
	 */
	public render(opt: RWaterMarkOptions) {
		this.container.removeChild(this.el);
		this.options = Object.assign(defaultOptions, opt);
		this.disconnect();
		this.setWaterMark();
	}
}
