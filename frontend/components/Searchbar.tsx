/* eslint-disable */
// style
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import {
  InputBase,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from "@mui/material";
import defaultProfile from "../public/images/defaultProfile.png";
// 기능
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// 검색바 스타일
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: "black",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  marginLeft: 0,
  width: "50%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

function Searchbar() {
  const router = useRouter();
  // 테스트용 데이터
  const artList = [
    { artist: "jisu", title: "love1" },
    { artist: "daye", title: "love2" },
    { artist: "nayeong", title: "love3" },
    { artist: "geuntae", title: "love4" },
    { artist: "jongjune", title: "love5" },
    { artist: "love", title: "love6" },
    { artist: "love2", title: "love7" },
    { artist: "love3", title: "love8" },
  ];
  // 검색결과창 보여주는 기능
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredArtistData, setFilteredArtistData] = useState([]);
  const [filteredTitleData, setFilteredTitleData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleSearchInput = (event: any) => {
    event.preventDefault();
    setSearchValue(event.target.value);
  };
  // 검색 클릭했을 때 결과창 닫고 검색어 초기화
  const handleArtistClick = (event: any) => {
    event.preventDefault();
    setSearchValue("");
    setFilteredArtistData([]);
    setFilteredTitleData([]);
    setIsLoading(true);
    router.push("/artist");
  };
  // X 눌렀을 때 초기화
  const handleClearText = (event: any) => {
    event.preventDefault();
    setSearchValue("");
    setFilteredArtistData([]);
    setFilteredTitleData([]);
    setIsLoading(true);
  };
  // 검색 필터링
  useEffect(() => {
    const searchFilter = setTimeout(() => {
      // 아티스트 필터링
      const newArtistFilter = artList.filter((art) => {
        return art.artist.toLowerCase().includes(searchValue.toLowerCase());
      });
      // 작품명 필터링
      const newTitleFilter = artList.filter((art) => {
        return art.title.toLowerCase().includes(searchValue.toLowerCase());
      });
      if (searchValue.length < 3) {
        setFilteredArtistData([]);
        setFilteredTitleData([]);
        setIsLoading(true);
      } else if (searchValue.length >= 3) {
        setFilteredArtistData(newArtistFilter);
        setFilteredTitleData(newTitleFilter);
        setIsSearchResult(true);
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(searchFilter);
  }, [searchValue]);

  // 검색영역 밖 클릭시 닫기
  const searchInputRef = useRef<any>(null);
  const [isSearchResult, setIsSearchResult] = useState<boolean>(false);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsSearchResult(false);
      } else {
        setIsSearchResult(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchInputRef]);

  return (
    <Search ref={searchInputRef}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="작품명 혹은 작가명을 입력하세요."
          inputProps={{ "aria-label": "search" }}
          fullWidth
          onChange={handleSearchInput}
          value={searchValue}
        />
        {searchValue ? (
          <Button sx={{ color: "black" }} onClick={handleClearText}>
            X
          </Button>
        ) : null}
      </div>

      {searchValue &&
        (searchValue.length >= 3 && !isLoading ? (
          (filteredArtistData.length != 0 || filteredTitleData.length != 0) && (
            <List
              sx={{
                bgcolor: "background.paper",
                position: "absolute",
                zIndex: 1,
                width: "100%",
                border: "1px solid black",
                borderRadius: 1,
              }}
              style={{ visibility: isSearchResult ? "visible" : "hidden" }}
            >
              <ListItem>
                <ListItemText primary="작가" />
              </ListItem>
              <Divider sx={{ mx: 2 }} />
              {filteredArtistData.length != 0 ? (
                <div
                  style={{ borderBottom: "1px solid black", paddingBottom: 10 }}
                >
                  {filteredArtistData.slice(0, 3).map((value, key) => {
                    return (
                      <div>
                        <ListItem
                          key={key}
                          onClick={handleArtistClick}
                          style={{
                            cursor: "pointer",
                            paddingBottom: 0,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <Image src={defaultProfile} alt="thumbnail" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={`${value.artist}`} />
                        </ListItem>
                        <Divider sx={{ mr: 2, ml: 4 }} component="li" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ListItem>
                  <ListItemText primary="No result" />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary="작품" />
              </ListItem>
              <Divider sx={{ mx: 2 }} />
              {filteredTitleData.length != 0 ? (
                <div>
                  {filteredTitleData.slice(0, 3).map((value, key) => {
                    return (
                      <div>
                        <ListItem
                          key={key}
                          style={{ cursor: "pointer", paddingBottom: 0 }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <Image src={defaultProfile} alt="thumbnail" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={`${value.title}`} />
                        </ListItem>
                        <Divider sx={{ mr: 2, ml: 4 }} component="li" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ListItem>
                  <ListItemText primary="No result" />
                </ListItem>
              )}
            </List>
          )
        ) : (
          <List
            sx={{
              backgroundColor: "white",
              position: "absolute",
              zIndex: 1,
              width: "100%",
              border: "1px solid black",
              borderRadius: 1,
            }}
          >
            <ListItem>
              <ListItemText primary="Loading..." />
            </ListItem>
          </List>
        ))}
    </Search>
  );
}

export default Searchbar;
