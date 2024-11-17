import { Tabs, Tab } from "@nextui-org/react";


export default function TabComp({ tabnames }) {
  return (
    <div className="flex w-full flex-col bg-[#272828] ">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider flex justify-around",
          cursor: "w-full bg-white",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-white group-data-[selected=true]:font-bold"
        }}

      >
        {
          tabnames.map((tabname) => (
            <Tab
              key={tabname}
              title={
                <div className="flex items-center space-x-2">

                  <span className="text-white">{tabname}</span>

                </div>
              }

            />
          ))
        }

      </Tabs>
    </div>
  );
}