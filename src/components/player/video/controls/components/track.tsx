import { motion } from "framer-motion";
import classNames from "classnames";

interface Props {
    min?: number;
    max?: number;
    value: number;
    step?: number;
    disabled?: boolean;
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export default function Track({
    min = 0, max = 1, step = .001, value = 0,
    className, disabled, onChange = () => {},
}: Props) {
    value === Infinity && (value = 0);
    const progress = (value / max * 100).toFixed(3);

    return <motion.div className={classNames("track", { disabled: disabled }, className)}>
        <motion.div className="track__progress" style={{ '--width': progress } as any} />
        <motion.div className="track__total" />
        <motion.input
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={onChange}
            className="track__input"
        />
    </motion.div>
}