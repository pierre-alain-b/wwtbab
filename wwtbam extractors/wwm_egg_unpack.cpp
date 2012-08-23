#include <iostream>
#include <fstream>
#include <Windows.h>

using namespace std;

#pragma pack(push)  /* push current alignment to stack */
#pragma pack(1)     /* set alignment to 1 byte boundary */

struct IMGDESC
{
	WORD w;
	WORD h;
};

struct FILEHEAD
{
	DWORD bHeadEntrys;
	DWORD additionalHeader;
	DWORD offsetOther; //after header
	IMGDESC desc[0];
};

struct TGAHEADER
{
	byte  identsize;          // size of ID field that follows 18 byte header (0 usually)
    byte  colourmaptype;      // type of colour map 0=none, 1=has palette
    byte  imagetype;          // type of image 0=none,1=indexed,2=rgb,3=grey,+8=rle packed

    short colourmapstart;     // first colour map entry in palette
    short colourmaplength;    // number of colours in palette
    byte  colourmapbits;      // number of bits per palette entry 15,16,24,32

    short xstart;             // image x origin
    short ystart;             // image y origin
    short width;              // image width in pixels
    short height;             // image height in pixels
    byte  bits;               // image bits per pixel 8,16,24,32
    byte  descriptor;         // image descriptor bits (vh flip bits)
};

#pragma pack(pop)   /* restore original alignment from stack */

void filltgaheader(TGAHEADER* tga, WORD w, WORD h)
{
	ZeroMemory(tga, sizeof(TGAHEADER));
	tga->imagetype = 2;
	tga->width = w;
	tga->height = h;
	tga->bits = 24;
	tga->descriptor = 1 << 5;
}

int main(int argc, char* argv[])
{
	HANDLE f = CreateFile(L"D:\\games\\Wer wird Millionär\\Data\\Screens\\BEEgg.egg", GENERIC_READ, 0, NULL, OPEN_EXISTING, 0, NULL);
	HANDLE map = CreateFileMapping(f, NULL, PAGE_READONLY, 0, 0, NULL);
	LPVOID mem = MapViewOfFile(map, FILE_MAP_READ, 0, 0, 0);

	FILEHEAD* s = reinterpret_cast<FILEHEAD*>(mem);

	char fname[10] = "";
	TGAHEADER tga = {};
	filltgaheader(&tga, 0, 0);

	DWORD currentoffset = 0;

	DWORD nEntrys = s->bHeadEntrys / sizeof(IMGDESC);

	currentoffset = sizeof(FILEHEAD) + s->bHeadEntrys + s->additionalHeader;

	cout << "initial offset: " << currentoffset << endl;

	//return 0;

	for(int i = 0; i < nEntrys; i++)
	{
		tga.width = s->desc[i].w;
		tga.height = s->desc[i].h;
		//tga.ystart = s->desc[i].w;

		sprintf(fname, "%d.tga\0", i);

		ofstream out (fname, ios::out | ios::binary);

		out.write(const_cast<const char*>(reinterpret_cast<char*>(&tga)), sizeof(TGAHEADER));

		DWORD start = currentoffset;
		DWORD end = currentoffset + s->desc[i].w * s->desc[i].h * 3;

		DWORD pstarti = reinterpret_cast<DWORD>(mem) + start;
		const char* pstart = const_cast<const char*>(reinterpret_cast<char *>( reinterpret_cast<DWORD *>(pstarti) ));

		out.write(pstart, end - start);
		out.close();

		currentoffset = end;
	}

	cout << "end offset: " << currentoffset << endl;

	DWORD *addHeadOffsets = reinterpret_cast<DWORD *>( reinterpret_cast<DWORD>(mem)  + sizeof(FILEHEAD) + s->bHeadEntrys);
	for(int i = 0; i < s->additionalHeader / 4; i++)
	{
		DWORD start = sizeof(FILEHEAD) + s->bHeadEntrys + s->additionalHeader + s->offsetOther;

		start += addHeadOffsets[i];
		DWORD end;
		
		//if(i < (s->additionalHeader / 4) - 1)
			end = start + 640*480*3; //addHeadOffsets[i + 1];
		//else
//			end = GetFileSize(f, NULL);


		tga.width = 640;
		tga.height = 480;
		//tga.ystart = s->desc[i].w;

		sprintf(fname, "b%d.tga\0", i);

		ofstream out (fname, ios::out | ios::binary);

		out.write(const_cast<const char*>(reinterpret_cast<char*>(&tga)), sizeof(TGAHEADER));

		DWORD pstarti = reinterpret_cast<DWORD>(mem) + start;
		const char* pstart = const_cast<const char*>(reinterpret_cast<char *>( reinterpret_cast<DWORD *>(pstarti) ));

		out.write(pstart, end - start);
		out.close();
	}

	return 0;
}