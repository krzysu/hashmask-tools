import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/core";
import { useDataProvider } from "../context/DataProvider";
import { MaskList } from "../components/MaskList";
import { queryMasks } from "../queries";
import { ViewMask } from "../../shared/types";

const Faq: FC<{ title: string }> = ({ title, children }) => (
  <Box mb="8">
    <Text fontSize="xl" mb="2" fontWeight="bold">
      {title}
    </Text>
    {children}
  </Box>
);

const Index: FC = () => {
  const { openseaDB } = useDataProvider();
  const [rarestMasks, setRarestMasks] = useState<ViewMask[]>([]);
  const [highPriceSoldMasks, setHighPriceSoldMasks] = useState<ViewMask[]>([]);
  const [cheapestMasks, setCheapestMasks] = useState<ViewMask[]>([]);

  useEffect(() => {
    const { items } = queryMasks({
      openseaDB,
      sortBy: "score",
      isOffered: true,
    });
    setRarestMasks(items.slice(0, 5));
  }, [openseaDB]);

  useEffect(() => {
    const { items } = queryMasks({
      openseaDB,
      sortBy: "lastPriceDesc",
      isOffered: false,
    });
    setHighPriceSoldMasks(items.slice(0, 5));
  }, [openseaDB]);

  useEffect(() => {
    const { items } = queryMasks({
      openseaDB,
      sortBy: "offeredPrice",
      isOffered: true,
    });
    setCheapestMasks(items.slice(0, 5));
  }, [openseaDB]);

  return (
    <>
      <Head>
        <title>{`HashmaskTools`}</title>
      </Head>

      <Box>
        <Heading mb="20" size="lg">
          HashmaskTools - easily browse and compare Hashmasks, their explicit
          and implicit traits, recent prices or availability to find your next
          great deal.
        </Heading>

        <Box mb="12">
          <Heading as="h3" mb="8">
            Rare for sale
          </Heading>
          <MaskList masks={rarestMasks} />
        </Box>

        <Box mb="12">
          <Heading as="h3" mb="8">
            Sold for highest price
          </Heading>
          <MaskList masks={highPriceSoldMasks} />
        </Box>

        <Box mb="12">
          <Heading as="h3" mb="8">
            Cheapest for sale
          </Heading>
          <MaskList masks={cheapestMasks} />
        </Box>

        <Box mb="12">
          <Heading as="h3" mb="8">
            FAQ
          </Heading>
          <Faq title="How rarity score is calculated?">
            <Text fontSize="lg">
              Rarity score is based only on explicit traits. Each trait
              uniqueness is multiplied with others and then normalized across
              scores for all Hashmasks. In mathematical terms, it looks like
              below.
            </Text>
            <OrderedList>
              <ListItem fontSize="lg">
                Let's take mask #1 as an example: Character is Male, one of
                8660; Mask is Chinese, one of 885; Eyes are Dark, one of 7420;
                Skin is Dark, one of 3784; and No Item means it's like one from
                14533 other masks.
              </ListItem>
              <ListItem fontSize="lg">
                So individual score for mask #1 would be <br />
                Math.log(8660 * 885 * 7420 * 3784 * 14533) = 42.586706117523775
              </ListItem>
              <ListItem fontSize="lg">
                The same way score is calculated for all other masks, i.e. the
                rarest mask is #3891 <br />
                Math.log(12 * 1 * 12 * 12 * 14533) = 17.03889715399017
              </ListItem>
              <ListItem fontSize="lg">
                In the end, the rarity score is normalized for all Hashmasks
                between 1 and 999 to make it more user-friendly.
              </ListItem>
            </OrderedList>
            <Text fontSize="lg">
              If you have a better idea for the rarity score calculation, let me
              know. I can also share my script on demand.
            </Text>
          </Faq>
          <Faq title="How often are prices updated?">
            <Text fontSize="lg">
              Offered price and last price for each Hashmask is queried from
              OpenSea API every 6 hours. That means prices displayed here might
              be out of sync with OpenSea. Use the OpenSea link next to each
              Hashmask to easily check availability.
              <br />
              Having prices queried once for all Hashmasks enables instant
              filtering and sorting to help you find the next great deal.
            </Text>
          </Faq>
          <Faq title="How can I contribute to the collections database?">
            <Text fontSize="lg">
              Collections are kept in{" "}
              <Link
                color="cyan.800"
                href="https://github.com/krzysu/hashmasks-db"
                isExternal
              >
                this Github repository
              </Link>
              , you can contribute easily by submitting a Pull Request. You can
              also contact me directly on{" "}
              <Link
                color="cyan.800"
                href="https://twitter.com/krzysu"
                isExternal
              >
                Twitter
              </Link>
              {" or "}
              <Link
                color="cyan.800"
                href="https://discordapp.com/users/krzysu#6531"
                isExternal
              >
                Discord
              </Link>
              .
            </Text>
          </Faq>
          <Faq title="How can I support HashmaskTools?">
            <Text fontSize="lg">
              I work on HashmaskTools in my free time. If you like it, then
              consider donating to the development fund. I accept ETH or ERC20
              on mainnet or on Loopring L2. You can find the address in the
              footer.
              <br />
              All OpenSea links use my referral code. By buying from the
              referral link you also support this project.
              <br />I would also appreciate contributions to{" "}
              <Link
                color="cyan.800"
                href="https://github.com/krzysu/hashmasks-db"
                isExternal
              >
                Hashmasks DB repository on Github
              </Link>
              .
            </Text>
          </Faq>
        </Box>
      </Box>
    </>
  );
};

export default Index;
