import NavbarMobile from "@/components/navbar-mobile";
import { Button } from "@/components/ui/button";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useLockedBody, useToggle, useWindowSize } from "usehooks-ts";

const BurgerButton = () => {
  const [value, toggle, setValue] = useToggle();
  const [locked, setLocked] = useLockedBody(false, "root");
  const { width } = useWindowSize();

  const hamburgerClickHandler = () => {
    toggle();
    setLocked(!locked);
  };

  useEffect(() => {
    if (width >= 768 && value) {
      setValue(false);
      setLocked(false);
    }
  }, [width, value, setValue, setLocked]);

  return (
    <>
      <Button
        className="block px-3 md:hidden"
        variant="outline"
        onClick={hamburgerClickHandler}
        aria-label="Toggle menu"
      >
        {value ? (
          <Cross2Icon className="h-4 w-4" />
        ) : (
          <HamburgerMenuIcon className="h-4 w-4" />
        )}
      </Button>

      <NavbarMobile value={value} />
    </>
  );
};

export default BurgerButton;
