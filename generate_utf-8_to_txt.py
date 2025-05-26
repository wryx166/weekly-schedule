import unicodedata


def is_chinese(char):
    """判断字符是否为CJK统一汉字或扩展汉字"""
    cp = ord(char)
    # return (
    #     (0x4E00 <= cp <= 0x9FFF) or       # 基本汉字
    #     (0x3400 <= cp <= 0x4DBF) or       # 扩展A
    #     (0x20000 <= cp <= 0x2A6DF) or     # 扩展B
    #     (0x2A700 <= cp <= 0x2B73F) or     # 扩展C
    #     (0x2B740 <= cp <= 0x2B81F) or     # 扩展D
    #     (0x2B820 <= cp <= 0x2CEAF) or     # 扩展E
    #     (0x2CEB0 <= cp <= 0x2EBEF)        # 扩展F
    # )
    # return (
    #         (0x4E00 <= cp <= 0x9FFF) or  # 基本汉字 (20924字)
    #         (0x3400 <= cp <= 0x4DBF) or  # 扩展A (6582字)
    #         (0xF900 <= cp <= 0xFAFF)  # 兼容汉字(如﨎等重复编码字)
    # )
    return (
            (0x4E00 <= cp <= 0x9FFF)
    )

def is_gb2312(data: bytes) -> bool:
    """
    判断字节数据是否符合GB2312编码规则
    :param data: 要检测的字节数据
    :return: True表示符合GB2312编码规则
    """
    length = len(data)
    i = 0
    while i < length:
        # 单字节ASCII字符（0x00-0x7F）
        if data[i] <= 0x7F:
            i += 1
            continue

        # 需要双字节处理但剩余长度不足
        if i + 1 >= length:
            return False

        byte1 = data[i]
        byte2 = data[i+1]

        # 检查首字节范围：0xB0-0xF7
        if not (0xB0 <= byte1 <= 0xF7):
            return False

        # 检查次字节范围：0xA0-0xFE沐霂
        if not (0xA0 <= byte2 <= 0xFE):
            return False

        i += 2
    return True


def generate_chinese_to_txt(filename):
    """
    生成所有UTF-8编码支持的可见字符并保存到文件

    :param filename: 输出文件名
    """
    with open(filename, 'w+', encoding='utf-8', errors='strict') as f:
        for cp in range(0x0000, 0x10FFFF + 1):
            try:
                char = chr(cp)
                # 双过滤条件：是中文且是可见字符
                # if is_chinese(char) and is_visible_character(char) and is_gb2312(char):
                #     # 尝试编码验证
                #     char.encode('utf-8')
                #     f.write(char)
                #     f.write('\n')
                try:
                    # 先尝试编码为GB2312，再校验字节范围
                    gb_bytes = char.encode('gb2312', errors='strict')
                    if is_chinese(char) and is_visible_character(char) and is_gb2312(gb_bytes):
                        f.write(char)
                        f.write('\n')
                except UnicodeEncodeError:
                    continue  # 跳过无法被GB2312编码的字符
            except UnicodeEncodeError:
                continue  # 跳过不支持的字符
            except ValueError:
                continue  # 跳过代理对字符（Surrogate）


def is_visible_character(char):
    return char.isprintable() and unicodedata.category(char)[0] != 'C'


# 使用示例
generate_chinese_to_txt('chinese.txt')
