var WindowHeight = 1000;
var WindowWidth = 900;
var LevelCell = 30;
var GameCycle = 2000;
var BottomMenuHeight = 100;
var PlayerSize = 100;
var FramesPerSecond = 60;
var LevelTime = 99;
var NumberOfLevels = 11;

var FirstYearTeachers = [
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/20429751_10210419669592809_8120883893813724813_n.jpg?_nc_cat=105&_nc_ht=scontent.fias1-1.fna&oh=36e3d31a89878957be68b7ed05b3a7ea&oe=5CB85E1E',
	'https://profs.info.uaic.ro/~fltiplea/images/Ferucio.gif',
	'https://www.virusbulletin.com/files/2914/6600/6130/108x163-dragos-gavrilut.jpg',
	'https://0.academia-photos.com/24303958/6657191/7522419/s200_florin.iacob.jpg_oh_651e33c7ba52780116dc6183756cdef5_oe_5539b481___gda___1429098350_a2cd668deb5da159eab2f3721172beba',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyKaJMhUVxsUW_fBEWqjGVX0-BJGaqiXS5uXgPjALDPUsXXIYe',
	'https://fmse.info.uaic.ro/wp-content/uploads/2018/03/dl_small-14.jpg',
	'https://profs.info.uaic.ro/~stefan.ciobaca/photo.jpg',
	'https://i1.rgstatic.net/ii/profile.image/696848343896065-1543153000698_Q512/Paula_Andreea_Onofrei.jpg',
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/21752003_1304087449714313_2728615220820782816_n.jpg?_nc_cat=105&_nc_ht=scontent.fias1-1.fna&oh=1778be6a1caa3a5dae2e29aa7801e6ff&oe=5CFE0869',
	'https://profs.info.uaic.ro/~summerschool/2017/summerschool/public/images/participants-photos/vlad_radulescu_img.jpg'
];

var SecondYearTeachers = [
	'https://profs.info.uaic.ro/~stefan.ciobaca/photo.jpg',
	'https://i1.rgstatic.net/ii/profile.image/696848343896065-1543153000698_Q512/Paula_Andreea_Onofrei.jpg',
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/25498368_563314850681709_7030529105698131313_n.jpg?_nc_cat=104&_nc_ht=scontent.fias1-1.fna&oh=b2c30707b1e96cd63534eb6db191d89d&oe=5CF1FECD',
	'https://www.librariaonline.ro/images/authors/sabin_buraga.jpg',
	'https://profs.info.uaic.ro/~summerschool/summerschool/public/images/participants-photos/lenuta_alboaie_img.jpg',
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/20429751_10210419669592809_8120883893813724813_n.jpg?_nc_cat=105&_nc_ht=scontent.fias1-1.fna&oh=36e3d31a89878957be68b7ed05b3a7ea&oe=5CB85E1E',
	'http://www.info.uaic.ro/bin/download/XWiki/acf/cristian_frasinaru_bw.jpg',
	'https://profs.info.uaic.ro/~adiftene/Img/AdrianIftene.jpg',
	'https://www.centric.eu/Renderers/ShowMedia.ashx?i=MediaArchive:d26ff25f-0694-4ce1-82f7-e8a8a42ca6a1',
	'https://www.testable.org/assets/img/team/ciprian-amariei.jpg'
];

var ThirdYearTeachers = [
	'https://profs.info.uaic.ro/~fltiplea/images/Ferucio.gif',
	'https://www.virusbulletin.com/files/2914/6600/6130/108x163-dragos-gavrilut.jpg',
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/25498368_563314850681709_7030529105698131313_n.jpg?_nc_cat=104&_nc_ht=scontent.fias1-1.fna&oh=b2c30707b1e96cd63534eb6db191d89d&oe=5CF1FECD',
	'https://www.librariaonline.ro/images/authors/sabin_buraga.jpg',
	'https://www.centric.eu/Renderers/ShowMedia.ashx?i=MediaArchive:d26ff25f-0694-4ce1-82f7-e8a8a42ca6a1',
	'http://profs.info.uaic.ro/~ciortuz/LC.foto2005.jpg',
	'http://eurolan.info.uaic.ro/2015/lecturers/cristea.jpg',
	'https://scontent.fias1-1.fna.fbcdn.net/v/t1.0-9/600896_536861873030715_1710852518_n.jpg?_nc_cat=103&_nc_ht=scontent.fias1-1.fna&oh=4b030bac5adaaf03656b7112c2db8100&oe=5CC4B99C',
	'http://www.math1976-uaic.ro/images/rasim.JPG',
	'https://profs.info.uaic.ro/~summerschool/summerschool/public/images/participants-photos/lenuta_alboaie_img.jpg'
];
