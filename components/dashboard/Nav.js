"use client";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sheeet from "./sheeet";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import axios from "axios";
import { useUserData } from "../../contexts/userrContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { useTheme } from "../../contexts/themeContext";
import { ScrollArea } from "../ui/scroll-area";

export default function Nav() {
  const router = useRouter();
  const { isDarkMode, baseColor, toggleTheme } = useTheme();
  const { coinPrices, setCoinPrices } = useUserData();
  const [loading, isloading] = useState(false);
  const { details, email, setDetails } = useUserData();
  const deposits = [
    {
      coinName: "Bitcoin",
      short: "Bitcoin",
      image: "/assets/bitcoin.webp",
      address: "0xiohxhihfojdokhijkhnofwefodsdhfodhod",
    },
    // {
    //   coinName: "Ethereum",
    //   short: "Ethereum",
    //   image: "/assets/ethereum.webp",
    //   address: "0xiohxhihfojhijkhnowefodsdhfodhod",
    // },
    // {
    //   coinName: "Tether USDT",
    //   short: "Tether",
    //   image: "/assets/Tether.webp",
    //   address: "0Xxiohxhihfookhijkhnofwefodsdhfodhod",
    // },
  ];
  const handleReadNotif = async () => {
    if (!details.isReadNotifications) {
      try {
        // Send a POST request to mark notifications as read
        const response = await axios.post(`/notifs/readNotifs/api`, { email });

        if (response.status === 200) {
          // Notifications marked as read successfully
          // Now, you can update the user's details to set isReadNotifications to true
          setDetails((prevDetails) => ({
            ...prevDetails,
            isReadNotifications: true,
          }));
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to mark notifications as read:", response.data);
        }
      } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("Error marking notifications as read:", error);
      }
    }
  };
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (details.notifications && details.notifications.length > 0) {
      setNotifications(details.notifications);
    }
  }, [details]);

  // ...

  const formatRelativeTime = (dateString) => {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Calculate the relative time to now
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Map over notifications and format the date as relative time for each
  const formattedNotifications = notifications
    ? notifications.map((notification) => ({
        ...notification,
        date: formatRelativeTime(notification.date), // Format as relative time
      }))
    : [];
  const sortedNotifications = formattedNotifications.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Compare dates in descending order (newest first)
  });

  const handleNotificationClick = (id) => {
    isloading(true);
    // Send a DELETE request to the backend API to delete the notification
    axios
      .delete(`/notifs/deleteNotifs/api/${id}/${email}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedNotifications = notifications.filter(
            (notification) => notification.id !== id
          );
          setNotifications(updatedNotifications);
          isloading(false);
        } else {
          // Handle any errors or display an error message to the user
          console.error("Failed to delete notification:", response.data);
          isloading(false);
        }
      })
      .catch((error) => {
        // Handle network errors or other unexpected errors
        console.error("Error deleting notification:", error);
        isloading(false);
      });
  };
  useEffect(() => {
    const fetchCoinPrices = async () => {
      try {
        // Create an array of coin symbols for API request
        const coinSymbols = deposits.map((coin) => coin.short.toLowerCase());

        // API request to fetch coin prices
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinSymbols.join(
            ","
          )}&vs_currencies=usd`
        );

        // Update coinPrices state with fetched prices
        setCoinPrices(response.data);
      } catch (error) {
        console.error("Error fetching coin prices:", error);
      }
    };

    fetchCoinPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    // Remove the "token" cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the logout page or any other desired action
    router.replace("/auth"); // Replace "/logout" with your actual logout route
  };

  return (
    <>
      <div
        className={`nav-container flex justify-between ${
          isDarkMode
            ? `${baseColor} text-white border border-white/5`
            : "text-slate-900 border-b bg-white"
        } duration-300  items-center py-3 px-5 transition-colors  `}
      >
        <div className="burger md:hidden cursor-pointer">
          <Sheet className="p-0">
            <SheetTrigger>
              <div className="burger-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={`px-4 ${
                isDarkMode ? `${baseColor} text-gray-200 border-0` : ""
              }`}
            >
              <Sheeet />
            </SheetContent>
          </Sheet>
        </div>
        <div className="title hidden md:flex">
          <h2 className="font-bold">
            <svg
              width="163"
              height="41"
              viewBox="0 0 163 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M84.4558 29.0941V23.8333H82.4722V20.8148H84.4558V16.8188H88.2792V20.8148H90.6365V23.8333H88.2792V30.0141C88.2792 31.1831 88.4804 32.0072 88.8829 32.4864H90.6365V35.5049H86.5543C85.5386 34.5658 84.9253 33.55 84.7145 32.4576C84.542 31.5377 84.4558 30.4165 84.4558 29.0941Z"
                fill={` ${isDarkMode ? "#C3C3C3" : "#222"}`}
              />
              <path
                d="M74.9802 20.8149H81.3334V23.8335H76.8488L79.5798 27.8869C80.8064 29.6309 81.4868 30.8287 81.6209 31.4804C81.6976 31.787 81.7359 32.1032 81.7359 32.429C81.7359 33.7898 81.228 34.8151 80.2123 35.505H72.8816V32.4865H78.1424L75.0664 27.9731C74.9323 27.7623 74.7214 27.4653 74.434 27.082C74.1657 26.6986 73.9548 26.392 73.8015 26.162C73.6482 25.9129 73.5428 25.7308 73.4853 25.6158C73.4278 25.5008 73.3511 25.3571 73.2553 25.1846C73.1595 24.9929 73.0924 24.83 73.0541 24.6959C72.9774 24.3318 72.9391 24.0347 72.9391 23.8047C72.9391 22.4056 73.6195 21.4091 74.9802 20.8149Z"
                fill={` ${isDarkMode ? "#C3C3C3" : "#222"}`}
              />
              <path
                d="M64.9311 35.505H61.9126C61.0693 34.4318 60.4944 33.3585 60.1877 32.2853C59.8811 31.212 59.7278 29.8705 59.7278 28.2606V20.8149H63.5512V28.5481C63.5512 30.2921 63.8962 31.6049 64.5862 32.4865H67.2597V20.8149H71.0831V35.505H68.0646L67.5472 34.4701C66.8189 35.1601 65.9469 35.505 64.9311 35.505Z"
                fill={` ${isDarkMode ? "#C3C3C3" : "#222"}`}
              />
              <path
                d="M50.719 35.505V20.8149H53.45L54.1687 22.3673C54.9353 21.3324 55.9032 20.8149 57.0722 20.8149H58.1934V24.6671H54.5424V35.505H50.719Z"
                fill={` ${isDarkMode ? "#C3C3C3" : "#222"}`}
              />
              <path
                d="M42.0672 18.8311H37.7263V15.3813H50.3178V18.8311H45.9769V35.5048H42.0672V18.8311Z"
                fill={` ${isDarkMode ? "#C3C3C3" : "#222"}`}
              />
              <path
                d="M163 17.6472V36.1649H159.508V17.6472H163Z"
                fill="#79BD44"
              />
              <path
                d="M153.767 30.0541H150.937C150.566 30.5126 150.381 31.0858 150.381 31.7736C150.381 32.4614 150.575 32.9993 150.963 33.3873H153.767V30.0541ZM148.08 22.647H154.64C155.698 23.2819 156.395 24.0138 156.73 24.8426C157.065 25.6539 157.233 26.765 157.233 28.1758V32.1439C157.233 33.6077 157.268 34.948 157.339 36.1649H154.323L153.847 35.2126C153.159 35.8475 152.189 36.1649 150.937 36.1649H149.27C147.771 35.1773 147.021 33.7576 147.021 31.9058C147.021 30.0364 147.789 28.5638 149.323 27.488H151.81C152.497 27.488 153.141 27.6997 153.741 28.1229V26.8002C153.741 26.1124 153.441 25.6539 152.841 25.4246H148.08V22.647Z"
                fill="#79BD44"
              />
              <path
                d="M140.074 30.2658V25.4247H138.249V22.6471H140.074V18.97H143.592V22.6471H145.761V25.4247H143.592V31.1123C143.592 32.1881 143.777 32.9465 144.148 33.3873H145.761V36.165H142.005C141.07 35.3008 140.506 34.3661 140.312 33.3609C140.153 32.5144 140.074 31.4827 140.074 30.2658Z"
                fill="#79BD44"
              />
              <path
                d="M133.519 36.1649V22.647H137.011V36.1649H133.519ZM133.519 17.6472H137.011V21.2185H133.519V17.6472Z"
                fill="#79BD44"
              />
              <path
                d="M120.99 22.647H123.82L124.217 23.5993C124.605 23.2466 124.967 22.9997 125.302 22.8586C125.654 22.7175 126.175 22.647 126.863 22.647H129.243C129.984 23.37 130.566 24.3048 130.989 25.4511C131.413 26.5974 131.624 27.8584 131.624 29.234C131.624 32.1792 130.742 34.4895 128.979 36.1649H126.73C125.796 36.1649 125.055 35.918 124.508 35.4242V40.133H120.99V22.647ZM124.508 33.3873H127.048C127.7 32.2762 128.026 30.927 128.026 29.3398C128.026 27.7526 127.691 26.4475 127.021 25.4246H124.508V33.3873Z"
                fill="#79BD44"
              />
              <path
                d="M115.249 30.0541H112.419C112.048 30.5126 111.863 31.0858 111.863 31.7736C111.863 32.4614 112.057 32.9993 112.445 33.3873H115.249V30.0541ZM109.562 22.647H116.122C117.18 23.2819 117.877 24.0138 118.212 24.8426C118.547 25.6539 118.715 26.765 118.715 28.1758V32.1439C118.715 33.6077 118.75 34.948 118.82 36.1649H115.805L115.329 35.2126C114.641 35.8475 113.671 36.1649 112.419 36.1649H110.752C109.253 35.1773 108.503 33.7576 108.503 31.9058C108.503 30.0364 109.271 28.5638 110.805 27.488H113.292C113.979 27.488 114.623 27.6997 115.223 28.1229V26.8002C115.223 26.1124 114.923 25.6539 114.323 25.4246H109.562V22.647Z"
                fill="#79BD44"
              />
              <path
                d="M101.103 33.5143H107V36H98.4897C97.0155 35.1143 95.8986 33.9929 95.1392 32.6357C94.3797 31.2786 94 29.8857 94 28.4571C94 27.0143 94.4244 25.6286 95.2732 24.3C96.122 22.9714 97.384 21.8714 99.0593 21H107V23.5714H101.103C100.5 24.0143 99.9751 24.7286 99.5284 25.7143C99.104 26.7 98.8918 27.6429 98.8918 28.5429C98.8918 29.4429 99.104 30.3857 99.5284 31.3714C99.9751 32.3571 100.5 33.0714 101.103 33.5143Z"
                fill="#79BD44"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 0C1.79086 0 0 1.79087 0 4.00001V32.2222C0 34.4314 1.79087 36.2222 4.00001 36.2222H16.3862V20.9485H20.6983V36.2222H32.2222C34.4314 36.2222 36.2222 34.4314 36.2222 32.2222V4C36.2222 1.79086 34.4314 0 32.2222 0H4ZM16.3862 14.6613H20.6983V19.1522H16.3862V14.6613Z"
                fill="#79BD44"
              />
            </svg>
          </h2>
        </div>{" "}
        {details === 0 ? (
          <div className="flex items-center gap-x-3">
            {" "}
            <Skeleton
              className={`md:w-52 md:h-10 rounded-md  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              }  w-24 h-10`}
            />
            <Skeleton
              className={`md:w-52 md:h-10 md:rounded-sm  ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10 rounded-full`}
            />
            <Skeleton
              className={`md:w-10 md:h-10 rounded-full ${
                isDarkMode ? "bg-[#333]" : "bg-gray-200/80"
              } w-10 h-10`}
            />
          </div>
        ) : (
          <div className="nav-tools text-sm flex items-center">
            <Select defaultValue="Bitcoin">
              <SelectTrigger
                className={`${isDarkMode ? "border border-[#222]" : "border"}`}
              >
                <SelectValue className="outline-none " />
              </SelectTrigger>
              <SelectContent
                className={`outline-none focus:outline-none ${
                  isDarkMode ? `${baseColor} text-white border-0` : ""
                }`}
              >
                {deposits.map((deps, index) => (
                  <div key={deps.coinName}>
                    <SelectItem key={deps.coinName} value={deps.coinName}>
                      <div className="flex items-center py-2">
                        <div className="image">
                          <Image
                            src={deps.image}
                            alt=""
                            width={20}
                            height={15}
                          />
                        </div>
                        <div className="price text-sm mx-2 font-bold">
                          {details !== 0 && details !== null ? (
                            <code>
                              {coinPrices[deps.short.toLowerCase()]
                                ? (
                                    details.tradingBalance /
                                    coinPrices[deps.short.toLowerCase()].usd
                                  ).toFixed(5)
                                : "0.00"}
                            </code>
                          ) : (
                            <span>calculating...</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger onClick={handleReadNotif}>
                <div className="notif-cont  ml-3 relative">
                  <div
                    className={` flex font-bold ${
                      isDarkMode
                        ? `md:bg-[#79BD4410] text-[#79BD44]`
                        : "md:bg-[#79BD4410] text-[#79BD44]"
                    } rounded-full md:rounded-lg md:px-3 md:py-3`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="md:w-5 md:h-5 w-5 h-5 md:mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 8a6 6 0 1112 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 01-.515 1.076 32.903 32.903 0 01-3.256.508 3.5 3.5 0 01-6.972 0 32.91 32.91 0 01-3.256-.508.75.75 0 01-.515-1.076A11.448 11.448 0 004 8zm6 7c-.655 0-1.305-.02-1.95-.057a2 2 0 003.9 0c-.645.038-1.295.057-1.95.057zM8.75 6a.75.75 0 000 1.5h1.043L8.14 9.814A.75.75 0 008.75 11h2.5a.75.75 0 000-1.5h-1.043l1.653-2.314A.75.75 0 0011.25 6h-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={`hidden md:block  ${
                        isDarkMode ? "text-[#79BD44]" : "text-[#79BD44]"
                      }`}
                    >
                      Notifications
                    </div>
                  </div>

                  {!details.isReadNotifications && (
                    <div className="notifier-dot absolute md:-right-1 right-0  top-0">
                      <div className="dot bg-red-500 md:w-3 md:h-3 animate__rubberBand animate__animated animate__infinite rounded-full w-2 h-2"></div>
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[350px] md:w-[400px] mx-3 pb-0 pt-4 px-1 relative overflow-hidden ${
                  isDarkMode ? "bg-[#222] border-white/5 text-gray-200" : ""
                }`}
              >
                <div className="tit px-3">
                  <div className="flex w-full justify-between items-center pb-4">
                    <div
                      className={`title-name font-bold ${
                        isDarkMode ? "text-white" : "text-black/90"
                      }`}
                    >
                      Notifications
                    </div>
                    <div className="titcount fleex">
                      <div className=" ">
                        <div
                          className={`py-1 px-2 rounded-full text-xs font-bold ${
                            isDarkMode ? "bg-[#333]" : "bg-black/5"
                          }`}
                        >
                          {notifications.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`line w-1/2 mx-auto mb-2 h-0.5  rounded-full ${
                      isDarkMode ? "bg-white/5" : "bg-black/5"
                    }`}
                  ></div>
                </div>
                <div className="cont ">
                  {notifications.length === 0 && (
                    <>
                      {" "}
                      <div className="message text-center text-sm py-4">
                        No notifications yet
                      </div>
                    </>
                  )}
                  {loading && (
                    <div
                      className={`loader-overlay absolute w-full h-full ${
                        isDarkMode ? "bg-black" : "bg-white"
                      } opacity-60 left-0 top-0 blur-2xl z-50`}
                    ></div>
                  )}
                  {notifications.length !== 0 && (
                    <>
                      <div>
                        <div className=" max-h-[300px] overflow-scroll overflow-x-hidden w-full px-3 py-3">
                          {sortedNotifications.reverse().map((notif, index) => (
                            <>
                              <div
                                className={`flex justify-between w-full items-start cursor-pointer transition-all`}
                                key={crypto.randomUUID()}
                              >
                                <div className="icon flex items-center flex-col">
                                  <div
                                    className={`${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } rounded-full p-3`}
                                  >
                                    {notif.type === "trade" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "transaction" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : notif.type === "intro" ? (
                                      <>🤝</>
                                    ) : notif.type === "verification" ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 text-sm"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div
                                    className={`linedwon   ${
                                      notif.method === "success"
                                        ? isDarkMode
                                          ? "bg-green-500/10 text-green-500"
                                          : "bg-green-500/20 text-green-500"
                                        : notif.method === "failure"
                                        ? isDarkMode
                                          ? "bg-red-500/10 text-red-500"
                                          : "bg-red-500/20 text-red-500"
                                        : notif.method === "pending"
                                        ? isDarkMode
                                          ? "bg-orange-500/10 text-orange-500"
                                          : "bg-orange-500/20 text-orange-500"
                                        : isDarkMode
                                        ? "bg-[#333] text-white"
                                        : "bg-[#33333320] text-white"
                                    } ${
                                      index !== notifications.length - 1
                                        ? "h-11 border border-dashed border-white/5"
                                        : ""
                                    }`}
                                    key={crypto.randomUUID()}
                                  ></div>
                                </div>
                                <div className="message w-full text-sm mx-2">
                                  <div
                                    className={`pb-1 pt-1 ${
                                      isDarkMode
                                        ? "text-white"
                                        : "text-black/90 font-bold"
                                    }`}
                                  >
                                    {" "}
                                    {notif.message}
                                  </div>
                                  <div
                                    className={`date text-xs capitalize ${
                                      isDarkMode ? "opacity-40" : "opacity-80"
                                    }`}
                                  >
                                    {notif.date}
                                  </div>
                                </div>
                                <div
                                  className="actiom pt-3 h-full /w-full"
                                  onClick={() =>
                                    handleNotificationClick(notif.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className={`w-4 h-4 ${
                                      isDarkMode
                                        ? "text-white/50 hover:text-white/80"
                                        : "text-black/30 hover:text-black/50"
                                    }`}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <button
              className={`theme-toggler  md:p-3  ${
                isDarkMode
                  ? "md:bg-[#79BD4420] text-[#79BD44] "
                  : "md:bg-[#79BD4410] text-[#79BD44]"
              } rounded-full mx-5 md:mx-2`}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-5 h-5 
                          }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Popover>
              <PopoverTrigger>
                <div
                  className={`flex font-bold text-[#79BD44] rounded-full md:p-3 ${
                    isDarkMode ? "md:bg-[#79BD4420]" : "md:bg-[#79BD4410]"
                  } md:mr-5 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 "
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={`w-[300px] mx-3  p-1   ${
                  isDarkMode ? "bg-[#111] text-white border border-white/5" : ""
                }`}
              >
                {/* <div className="header-title py-4 px-4 font-bold">
                  <h1 className="bgname text-lg">Menus</h1>
                </div> */}
                <div className="content1 grid grid-cols-3 gap-y-4 py-3 pt-5 gap-x-3 px-3">
                  <Link href="/dashboard/account" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/profile.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Profile</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/deposits" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/wallet.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Deposit</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/withdrawals" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/withdraw.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />
                      <p className="pt-2">Withdraw</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/markets" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3 relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="identifier absolute -top-1 -right-2">
                        <div className="px-2  font-normal bg-green-500 rounded-md text-white  text-[10px]">
                          Live
                        </div>
                      </div>
                      <Image
                        alt=""
                        src="/assets/increase.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Tradings</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/investments" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <Image
                        alt=""
                        src="/assets/money.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Investments</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/verify" passHref>
                    <div
                      className={`deposit flex flex-col items-center text-xs justify-center rounded-md font-bold p-3  relative ${
                        isDarkMode
                          ? "bg-white/5 hite/5 hover:bg-white/10"
                          : "bg-gray-300/20 text-black/80 hover:bg-black/5"
                      }`}
                    >
                      <div className="verification-identifier absolute -top-1 -right-2">
                        {details.isVerified ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-green-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-red-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <Image
                        alt=""
                        src="/assets/veraccount.png"
                        className="w-8 h-8"
                        width={1000}
                        height={1000}
                      />

                      <p className="pt-2">Verification</p>
                    </div>
                  </Link>
                </div>{" "}
                <div className="relative w-full flex items-center justify-center pt-4">
                  <div
                    className={` line h-0.5 w-1/2 mx-auto top-0 left-0 ${
                      isDarkMode ? "bg-white/5" : "bg-black/10"
                    } rounded-full`}
                  ></div>
                </div>
                <div
                  className={`logout flex items-center text-sm py-3 mb-4 mx-3 rounded-md text-red-600 mt-4 ${
                    isDarkMode
                      ? "bg-red-500/10 /border /border-red-600 font-bold"
                      : "bg-red-50"
                  } px-2 font-bold cursor-pointer`}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 010 1.06 6.5 6.5 0 109.192 0 .75.75 0 111.06-1.06 8 8 0 11-11.313 0 .75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
