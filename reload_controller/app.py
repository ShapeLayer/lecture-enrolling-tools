'''
이 파이썬 코드는 커서 위치를 기억하여 여러 창을 빠른 시간 안에 새로고침할 수 있도록 돕습니다.  
SpaceBar: 커서 위치를 기억합니다. 커서 위치는 여러개를 기억할 수 있으며, 코드 실행 중 기억을 지울수는 없습니다.
Enter: 기억한 위치로 커서를 이동시킨 후 새로고침을 시도합니다.  

* 이 코드가 위치한 경로에 `targets.json` 파일이 존재해야합니다. 내용은 비어있어도 됩니다.  
* 이 코드는 `targets.json` 파일에 커서 위치를 기억합니다. 기억한 커서 위치를 제거하고자 한다면 이 파일을 수정하세요.  

* 이 코드는 keyboard와 pywin32 모듈을 사용합니다. 아래 명령줄을 사용하여 필요한 모듈을 설치하세요.  
pip install keyboard pywin32
'''

import win32api, win32con
import keyboard
import json
from os import path
from time import sleep
if path.isfile('targets.json'):
    cursors = json.loads(open('targets.json', encoding='utf-8').read())
else:
    cursors = []

while True:
    if keyboard.is_pressed('space'):
        pos = win32api.GetCursorPos()
        if pos not in cursors:
            cursors += [pos]
        print('{} 저장됨'.format(pos))
        print('현재 등록 키 목록: {}'.format(cursors))
    elif keyboard.is_pressed('enter'):
        for cursor in cursors:
            win32api.SetCursorPos((cursor[0], cursor[1]))
            win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN,cursor[0], cursor[1],0,0)
            win32api.keybd_event(0x74, 0, 0, 0)
            sleep(0.03)
            win32api.keybd_event(0x74, 0, win32con.KEYEVENTF_KEYUP, 0)
            win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP,cursor[0], cursor[1],0,0)
        with open('targets.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(cursors))