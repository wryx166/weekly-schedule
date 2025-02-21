from fontTools.subset import Subsetter
from fontTools.ttLib import TTFont
import os

# woff2 字体裁剪

# 安装依赖
# pip install fonttools
# pip install brotli


font_list = [
    "./src/assets/fonts/AlibabaPuHuiTi-3/AlibabaPuHuiTi-3-75-SemiBold/AlibabaPuHuiTi-3-75-SemiBold.woff2",
    "./src/assets/fonts/AlibabaPuHuiTi-3/AlibabaPuHuiTi-3-115-Black/AlibabaPuHuiTi-3-115-Black.woff2",
    "./src/assets/fonts/MiSans/woff2/MiSans-Heavy.woff2",
]

# 读取需要保留的字符
with open('unicodes.txt', 'r', encoding='utf-8') as f:
    unicodes: str = f.read().strip()

unicodes = unicodes.replace('\n', '')

save_folder = "./src/assets/fonts/"

for font_path in font_list:
    os.path.isfile(font_path) or exit(f"File not found: {font_path}")
    font_name = os.path.basename(font_path)
    new_font_path = os.path.join(save_folder, font_name)
    font = TTFont(font_path)
    # 创建 Subsetter 对象
    subsetter = Subsetter()
    # 设置需要保留的字符
    subsetter.populate(text=unicodes)
    # 执行子集化
    subsetter.subset(font)
    # 保存子集化后的字体文件
    font.save(new_font_path)
print("Done")
