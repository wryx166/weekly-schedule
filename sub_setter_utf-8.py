import concurrent.futures
import shutil
from functools import partial

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
# save_folder = "./src/assets/fonts/"
save_folder = '.'

# 不进行任何裁剪
def move_fonts_to_save_folder(font_list, save_folder):
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)

    for font_path in font_list:
        if os.path.isfile(font_path):
            shutil.copy2(font_path, save_folder)
        else:
            print(f"File not found: {font_path}")


def get_characters_to_save():
    # 读取需要保留的字符
    with open('unicodes.txt', 'r', encoding='utf-8') as f:
        unicodes: str = f.read().strip()

    with open('chinese.txt', 'r', encoding='utf8') as f:
        unicodes += f.read().strip()
    unicodes = unicodes.replace('\n', '')
    # 去重
    unicodes = ''.join(set(unicodes.replace('\n', '')))
    return unicodes


# def sub_setter(unicodes):
#     for font_path in font_list:
#         os.path.isfile(font_path) or exit(f"File not found: {font_path}")
#         font_name = os.path.basename(font_path)
#         new_font_path = os.path.join(save_folder, font_name)
#         font = TTFont(font_path)
#         # 创建 Subsetter 对象
#         subsetter = Subsetter()
#         # 设置需要保留的字符
#         subsetter.populate(text=unicodes)
#         # 执行子集化
#         subsetter.subset(font)
#         # 保存子集化后的字体文件
#         font.save(new_font_path)
#     print("Done")
def sub_setter(unicodes):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # 使用偏函数固定 unicodes 参数
        task = partial(process_font, unicodes=unicodes)
        executor.map(task, font_list)
    print("Done")

def process_font(font_path, unicodes):
    os.path.isfile(font_path) or exit(f"File not found: {font_path}")
    font_name = os.path.basename(font_path)
    new_font_path = os.path.join(save_folder, font_name)

    font = TTFont(font_path)
    subsetter = Subsetter()
    subsetter.populate(text=unicodes)
    subsetter.subset(font)
    font.save(new_font_path)

if __name__ == '__main__':
    user_input = input("是否要进行裁剪? (y/n)[默认: n]: ").strip().lower()
    if user_input == 'y':
        sub_setter(get_characters_to_save())
    else:
        user_input = input("是否使用完整字体? (y/n)[默认: y]: ").strip().lower()
        if user_input == 'n':
            print("已取消裁剪")
        else:
            print("使用完整字体")
            move_fonts_to_save_folder(font_list, save_folder)
            print("Done")
