#include <iostream>
#include <fstream>
#include <Windows.h>

using namespace std;

struct file
{
	int nEntrys;
	struct
	{
		int offset;
		char name[0x104];
	} desc[1];
};

int main(int argc, char* argv[])
{
	HANDLE f = CreateFile(L"D:\\games\\Wer wird Millionär\\Data\\sfx\\audio.awf", GENERIC_READ, 0, NULL, OPEN_EXISTING, 0, NULL);
	HANDLE map = CreateFileMapping(f, NULL, PAGE_READONLY, 0, 0, NULL);
	LPVOID mem = MapViewOfFile(map, FILE_MAP_READ, 0, 0, 0);

	file* s = reinterpret_cast<file*>(mem);

	for(int i = 0; i < s->nEntrys; i++)
	{
		cout << s->desc[i].name << endl;

		ofstream out (s->desc[i].name, ios::out | ios::binary);

		int end;
		int start = s->desc[i].offset;
		if(i < s->nEntrys - 1)
			end = s->desc[i + 1].offset;
		else
			end = GetFileSize(f, NULL);

		DWORD pstarti = reinterpret_cast<DWORD>(mem) + start;

		const char* pstart = const_cast<const char*>(reinterpret_cast<char *>( reinterpret_cast<DWORD *>(pstarti) ));

		out.write(pstart, end - start);

		out.close();		
	}
	
	return 0;
}