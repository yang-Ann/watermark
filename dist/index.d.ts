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
/**
 * 创建水印
 */
export default class WaterMark {
    options: RWaterMarkOptions;
    el: HTMLDivElement;
    waterMarkOb: MutationObserver | null;
    constructor(opt: WaterMarkOptions);
    get container(): Element;
    init(): void;
    /**
     * 创建水印 img
     */
    createWaterMark(): string;
    /**
     * 设置水印
     */
    setWaterMark(): void;
    disconnect(): void;
    /**
   * 设置水印文本
   * @param text 水印文本
   */
    setText(text: string): void;
    /**
     * 重新渲染
     */
    render(opt: RWaterMarkOptions): void;
}
